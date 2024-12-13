import { getProducts } from "@/app/_actions/admin/products";
import { getCategories } from "@/app/_actions/admin/categories";
import ProductsTable from "@/components/admin/dashboard/tables/ProductsTable";
import { Plus } from "lucide-react";
import Link from "next/link";

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  searchParams: SearchParams;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  // Await and parse search params
  const params = await Promise.resolve(searchParams);

  // Parse search params safely
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const [productsData, categories] = await Promise.all([
    getProducts({
      search,
      category,
      page,
      limit: 10,
    }),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your store products
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <ProductsTable
        initialData={productsData}
        categories={categories}
        searchParams={{
          search,
          category,
          page: String(page),
        }}
      />
    </div>
  );
}
