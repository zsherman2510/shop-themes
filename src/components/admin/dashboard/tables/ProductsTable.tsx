"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { ProductWithCategory } from "@/types/product";
import { formatPrice } from "@/lib/utils/utils";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductsTableProps {
  initialData: {
    products: ProductWithCategory[];
    total: number;
    pages: number;
  };
  categories: Category[];
  searchParams: {
    search?: string;
    category?: string;
    page?: string;
  };
}

export default function ProductsTable({
  initialData,
  categories,
  searchParams,
}: ProductsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [categoryValue, setCategoryValue] = useState(
    searchParams.category || ""
  );

  const currentPage = Number(searchParams.page) || 1;

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newSearchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    []
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const queryString = createQueryString({
      search: value || undefined,
      category: categoryValue || undefined,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/products?${queryString}`);
    });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value);
    const queryString = createQueryString({
      search: searchValue || undefined,
      category: value || undefined,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/products?${queryString}`);
    });
  };

  const handlePageChange = (page: number) => {
    const queryString = createQueryString({
      search: searchValue || undefined,
      category: categoryValue || undefined,
      page: String(page),
    });

    startTransition(() => {
      router.push(`/dashboard/products?${queryString}`);
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          />
          <select
            value={categoryValue}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* ... table header ... */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isPending ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : initialData.products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  No products found
                </td>
              </tr>
            ) : (
              initialData.products.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800">
                        {product.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {product.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatPrice(Number(product.price))}
                  </td>
                  <td className="px-4 py-3 text-sm">{product.inventory}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.isActive
                          ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }
                      className="invisible rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:visible dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {initialData.products.length} of {initialData.total} products
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === initialData.pages}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
