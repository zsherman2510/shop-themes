import { getCategory } from "@/app/_actions/store/categories";
import { getProductsByCategory } from "@/app/_actions/store/products";
import ProductCard from "@/app/store/products/components/ProductCard";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.id);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id);

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-base-content/70">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
