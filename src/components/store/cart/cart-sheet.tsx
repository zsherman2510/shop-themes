"use client";

import { useCart } from "./cart-provider";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating checkout session");
      }

      if (!data.url) {
        throw new Error("No checkout URL returned");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error creating checkout session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Animated Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-all duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Animated Cart Sheet */}
      <div
        className={`fixed right-0 top-0 h-[100dvh] w-full sm:w-[400px] bg-base-100 z-[101] 
                   shadow-xl rounded-l-2xl transition-all duration-300 ease-out
                   transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full max-h-[100dvh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-base-content" />
              <h2 className="font-medium text-base">Shopping Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-base-content hover:rotate-90 transition-transform"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <ShoppingBag className="h-12 w-12 text-base-content/50 mb-4 animate-pulse" />
              <p className="text-base-content/70 mb-4">Your cart is empty</p>
              <Link
                href="/store"
                className="btn btn-primary btn-sm"
                onClick={onClose}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex gap-3 bg-base-200/50 p-3 rounded-lg hover:bg-base-200 
                               transition-all duration-200 hover:shadow-md"
                    >
                      {item.images[0] && (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden bg-base-300 flex-shrink-0">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-sm">
                          {item.name}
                        </h3>
                        <p className="text-base-content/70 text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-base-300 rounded-lg">
                            <button
                              className="btn btn-ghost btn-xs px-2 h-7 min-h-7 rounded-r-none hover:bg-base-300"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-ghost btn-xs px-2 h-7 min-h-7 rounded-l-none hover:bg-base-300"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-base-200 p-4 space-y-4 bg-base-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-base-content/70">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  className="btn btn-primary w-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Checkout"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
