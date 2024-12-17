"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";
import { useState } from "react";
import CartSheet from "./cart-sheet";

export default function CartIcon() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-ghost btn-circle text-base-content"
        onClick={() => setIsCartOpen(true)}
      >
        <div className="indicator">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="badge badge-sm indicator-item">{itemCount}</span>
          )}
        </div>
      </button>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
