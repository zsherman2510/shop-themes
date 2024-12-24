import Link from "next/link";
import { ProductWithPrice } from "@/app/_actions/store/products";
import { useCart } from "@/components/store/cart/cart-provider";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/FAFAFA/A3A3A3?text=Product+Image";

interface ProductCardProps {
  product: ProductWithPrice;
  showCartButton?: boolean;
}

export default function ProductCard({
  product,
  showCartButton,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-base-100 transition-all duration-300">
      <Link href={`/store/products/${product.id}`} className="flex-1">
        <div className="aspect-square overflow-hidden bg-base-200">
          <img
            src={product.images[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          {product.category && (
            <span className="text-xs font-medium text-primary">
              {product.category.name}
            </span>
          )}
          <h3 className="mt-2 font-medium text-base-content group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-base-content/70 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 text-lg font-bold text-base-content">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </Link>
      {showCartButton && (
        <div className="p-4 pt-0">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary w-full gap-2 group-hover:scale-105 transition-transform"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
