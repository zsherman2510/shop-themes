import Link from "next/link";
import { Category } from "@/app/_actions/store/categories";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group relative overflow-hidden rounded-lg">
        {category.image && (
          <div className="aspect-square w-full">
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-end p-6">
          <div>
            <h3 className="text-xl font-bold text-white">{category.name}</h3>
            {category.description && (
              <p className="mt-2 text-sm text-white/80">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
