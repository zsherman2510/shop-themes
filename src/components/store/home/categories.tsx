import Link from "next/link";
import { Category } from "@/app/_actions/store/categories";

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-base-content mb-8">
          Browse Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 image-full"
            >
              <figure>
                <img
                  src={category.image ?? ""}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body justify-end">
                <h3 className="card-title text-base-100 mb-2">
                  {category.name}
                </h3>
                <p className="text-base-100/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
