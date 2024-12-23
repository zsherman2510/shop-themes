import Link from "next/link";
import { Products } from "@prisma/client";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/FAFAFA/A3A3A3?text=Product+Image";

interface ProductCardProps {
  product: Products;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/store/products/${product.id}`}>
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={product.images[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-lg font-bold">${product.price.toString()}</p>
        </div>
      </div>
    </Link>
  );
}
