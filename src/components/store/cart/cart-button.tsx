"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";
import Link from "next/link";

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="btn btn-ghost btn-circle">
      <div className="indicator">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="badge badge-sm indicator-item">{itemCount}</span>
        )}
      </div>
    </Link>
  );
}
