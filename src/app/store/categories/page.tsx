import { getCategories } from "@/app/_actions/store/categories";
import CategoryCard from "@/app/store/categories/components/CategoryCard";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <h1 className="text-3xl font-bold mb-8 text-base-content">Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
