import { getProducts } from "./actions/get";
import ProductsTable from "./components/ProductTable";

// Type for search params
type SearchParams = { [key: string]: string | string[] | undefined };

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  // Await and parse search params
  const params = await Promise.resolve(searchParams);

  // Parse search params safely
  const search = typeof params.search === "string" ? params.search : "";
  const categoryId =
    typeof params.categoryId === "string" ? params.categoryId : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const productsData = await getProducts({
    search,
    categoryId,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your products and inventory
        </p>
      </div>

      <ProductsTable
        initialData={productsData}
        searchParams={{
          search,
          categoryId,
          page: String(page),
        }}
      />
    </div>
  );
}
