"use client";

import { useEffect } from "react";
import { useCart } from "@/components/store/cart/cart-provider";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-success mb-4">
        <CheckCircle className="w-16 h-16" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
      <p className="text-base-content/70 mb-8 text-center max-w-md">
        Your order has been confirmed. You will receive an email confirmation
        shortly.
      </p>
      <Link href="/store" className="btn btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
