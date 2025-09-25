"use server";

import { getCurrentSession } from "./auth";
import { getOrCreateCart } from "./cart-actions";

// import { getCurrentSession } from "@/actions/auth";
// import { getOrCreateCart } from "@/actions/cart-actions";

export const createCheckoutSession = async (cartId: string) => {
  const { user } = await getCurrentSession();
  const cart = await getOrCreateCart(cartId);

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Total in Kobo (smallest NGN unit)
  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Call Paystack API
  try {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEYS}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user?.email|| 'guest@test.com',
      amount: Math.round(totalPrice * 100),
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      metadata: {
        cartId: cart.id,
        userId: user?.id?.toString() || "-",
      },
    }),
  });

  const data = await response.json();
  console.log("Paystack API response:", data);

  if (!data.status || !data.data.authorization_url) {
    throw new Error(JSON.stringify(data));
  }

  return data.data.authorization_url;
} catch (err) {
  console.error("Paystack initialization error:", err);
  throw err;
}
};
