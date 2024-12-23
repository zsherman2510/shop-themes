import Link from "next/link";
import { Category } from "@/app/_actions/store/categories";
import PlaceholderImage from "@/components/ui/placeholderImage";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/store/categories/${category.id}`}>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-base-200/50 transition-all duration-300 hover:bg-base-200">
        <div className="aspect-[4/3] overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage className="h-full w-full" />
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-base-content">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-2 text-sm text-base-content/70 line-clamp-2">
              {category.description}
            </p>
          )}
          <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            Browse Collection
            <svg
              className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
