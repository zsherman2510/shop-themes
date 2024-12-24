"use client";

import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/store/cart/cart-provider";
import { useEffect } from "react";

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Clear the cart when the success page loads
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-base-content/70">
              Thank you for your purchase. We&apos;ll send you a confirmation
              email shortly.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/store" className="btn btn-primary w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <p className="text-sm text-base-content/60">
            If you have any questions, please email{" "}
            <a
              href="mailto:orders@example.com"
              className="text-primary hover:underline"
            >
              orders@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
