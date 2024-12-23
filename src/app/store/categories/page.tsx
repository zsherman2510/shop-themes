import { getCategories } from "@/app/_actions/store/categories";
import CategoryCard from "@/app/store/categories/components/CategoryCard";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-base-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
              Shop by Category
            </h1>
            <p className="mt-4 text-lg text-base-content/70">
              Browse our curated collection of digital assets and themes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
