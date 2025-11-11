import prisma from "@/lib/prisma";
import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(body))
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Sanity client
    const sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      token: process.env.SANITY_API_WRITE_TOKEN,
    });

    // ✅ Handle Paystack events
    switch (body.event) {
      case "charge.success": {
        const data = body.data;

        const cartId = data.metadata?.cartId;
        const userId = data.metadata?.userId;

        if (!cartId) {
          throw new Error("No cart ID in Paystack metadata");
        }

        const cart = await prisma.cart.findUnique({
          where: { id: cartId },
          include: { items: true },
        });

        if (!cart) {
          throw new Error("Cart not found");
        }

        const order = await sanityClient.create({
          _type: "order",
          orderNumber: data.reference, // Paystack reference instead of session.id
          orderDate: new Date().toISOString(),
          customerId: userId !== "-" ? userId : undefined,
          customerEmail: data.customer?.email,
          customerName: data.customer?.first_name + " " + data.customer?.last_name,
          paystackReference: data.reference,
          totalPrice: data.amount / 100, // amount is in kobo (NGN cents)
          orderItems: cart.items.map((item) => ({
            _type: "orderItem",
            _key: item.id,
            product: {
              _type: "reference",
              _ref: item.sanityProductId,
            },
            quantity: item.quantity,
            price: item.price,
          })),
          status: "PROCESSING",
        });

        await prisma.cart.delete({ where: { id: cartId } });
        break;
      }

      default:
        console.log(`Unhandled Paystack event: ${body.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log("Webhook error:", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
