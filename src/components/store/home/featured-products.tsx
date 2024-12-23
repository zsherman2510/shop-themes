"use client";

import { Products } from "@prisma/client";
import ProductCard from "@/app/store/products/components/ProductCard";
import { ProductWithPrice } from "@/app/_actions/store/products";

interface FeaturedProductsProps {
  products: ProductWithPrice[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const handleAddToCart = (product: ProductWithPrice) => {
    console.log("Adding to cart:", product);
    // TODO: Implement cart functionality
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-base-content/70">
            Explore our collection of premium digital assets
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                showCartButton
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
