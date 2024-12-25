"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart/cart-provider";
import { ShoppingCart } from "lucide-react";
import { ProductWithPrice } from "@/app/_actions/store/products";

interface AddToCartButtonProps {
  product: ProductWithPrice;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    const event = new CustomEvent("openCart");
    window.dispatchEvent(event);
  };

  return (
    <Button className="w-full" size="lg" onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
