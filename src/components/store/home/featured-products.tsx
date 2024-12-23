import Link from "next/link";
import { Products } from "@prisma/client";

interface FeaturedProductsProps {
  products: Products[];
}

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/FAFAFA/A3A3A3?text=Product+Image";

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-base-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-base-content mb-8">
          Featured Themes & Assets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/store/products/${product.id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <figure className="aspect-w-16 aspect-h-9">
                <img
                  src={product.images[0] || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-base-content">{product.name}</h3>
                <p className="text-base-content/70 line-clamp-2">
                  {product.description}
                </p>
                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-xl font-bold text-base-content">
                    ${product.price.toString()}
                  </span>
                  {product.images[0] && (
                    <span className="link link-primary">View Demo →</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
