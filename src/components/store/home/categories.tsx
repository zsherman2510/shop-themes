"use client";

import Link from "next/link";
import { Category } from "@/app/_actions/store/categories";

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-24 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
            Browse Categories
          </h2>
          <p className="mt-4 text-lg text-base-content/70">
            Explore our collection of premium digital assets
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/store/categories/${category.id}`}
              className="group p-8 bg-base-200/50 hover:bg-base-200 rounded-xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-base-content">
                    {category.name}
                  </h3>
                  <svg
                    className="w-6 h-6 text-base-content/30 group-hover:text-primary transition-colors duration-300"
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
                {category.description && (
                  <p className="text-base-content/70 text-sm">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
