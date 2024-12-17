"use client";

import { useCart } from "./cart-provider";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CheckoutModal from "../checkout/checkout-modal";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Cart Sheet */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-base-100 z-[70] shadow-xl"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-base-content" />
              <h2 className="font-semibold text-lg">Shopping Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-base-content"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <ShoppingBag className="h-12 w-12 text-base-content/50 mb-4" />
              <p className="text-base-content/70 mb-4">Your cart is empty</p>
              <Link href="/store" className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-base-200 p-3 rounded-lg"
                    >
                      {item.image && (
                        <div className="w-20 h-20 relative rounded-md overflow-hidden bg-base-300">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-base-content/70">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            className="btn btn-xs btn-ghost text-base-content"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-xs btn-ghost text-base-content"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            className="btn btn-xs btn-ghost text-error ml-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-4 bg-base-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          onClose();
        }}
      />
    </>
  );
}
