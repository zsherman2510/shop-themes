import { getProduct } from "@/app/_actions/store/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="aspect-square relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold">${product.price.toString()}</p>
          <p className="text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
