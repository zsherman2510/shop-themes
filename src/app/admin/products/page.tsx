import { getCategories } from "@/app/_actions/store/categories";
import { getProducts } from "./actions/get";
import ProductsTable from "./components/ProductsTable";

// Type for search params
type SearchParams = Promise<{
  search: string;
  categoryId: string;
  page: string;
}>;

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  // Await and parse search params
  const { search, categoryId, page } = await searchParams;

  // Fetch data server-side
  const productsData = await getProducts({
    search,
    categoryId,
    page: Number(page),
    limit: 10,
  });

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">
          Products
        </h1>
        <p className="text-sm text-base-content/70">
          Manage your products and inventory
        </p>
      </div>

      <ProductsTable
        initialData={productsData}
        categories={categories.categories}
        searchParams={{
          search,
          categoryId,
          page: String(page),
        }}
      />
    </div>
  );
}
