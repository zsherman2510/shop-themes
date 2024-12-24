"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";
import { useState, useEffect } from "react";
import CartSheet from "./cart-sheet";

export default function CartIcon() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("openCart", handleOpenCart);
    return () => window.removeEventListener("openCart", handleOpenCart);
  }, []);

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
