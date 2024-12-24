"use client";

import { getProducts } from "@/app/_actions/store/products";
import ProductCard from "./components/ProductCard";
import { useEffect, useState } from "react";
import { ProductWithPrice } from "@/app/_actions/store/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-base-content">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showCartButton />
        ))}
      </div>
    </div>
  );
}
