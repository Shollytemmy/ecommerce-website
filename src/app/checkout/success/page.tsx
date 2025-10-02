import { redirect } from "next/navigation";

const getPaystackTransaction = async (reference: string) => {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // always fresh
  });

  if (!res.ok) {
    throw new Error("Failed to verify transaction");
  }

  const data = await res.json();
  return data.data; // Paystack returns { status, message, data }
};

const CheckoutSuccessPage = async ({ searchParams }: { searchParams: { reference?: string } }) => {
  const reference = searchParams.reference;

  if (!reference) {
    redirect("/");
  }

  const transaction = await getPaystackTransaction(reference);

  if (!transaction) {
    redirect("/");
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 mb-6">
            We have received your order, and will send you a confirmation email shortly!
          </p>
          <div className="text-sm text-gray-500">
            Order total:{" "}
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(transaction.amount / 100)} 
          </div>
          <div className="text-sm text-gray-500">
            Order email: {transaction.customer.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
