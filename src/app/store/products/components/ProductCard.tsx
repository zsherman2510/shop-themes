import Link from "next/link";
import { Products } from "@prisma/client";

interface ProductCardProps {
  product: Products;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/store/products/${product.id}`}>
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={product.images[0]}
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
