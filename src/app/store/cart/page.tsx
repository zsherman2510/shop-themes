"use client";

import { useCart } from "@/components/store/cart/cart-provider";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CheckoutModal from "@/components/store/checkout/checkout-modal";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-base-content/70 mb-8">
          Add some products to your cart to continue shopping
        </p>
        <Link href="/store" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-base-100 p-4 rounded-lg"
                >
                  {/* ... item details ... */}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-base-100 p-6 rounded-lg sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              {/* ... summary details ... */}
              <button
                className="btn btn-primary w-full"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
