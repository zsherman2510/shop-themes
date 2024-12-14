import { getCustomers } from "./actions/get";
import CustomersTable from "./components/CustomerTable";

// Type for search params
type SearchParams = { [key: string]: string | string[] | undefined };

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  // Await and parse search params
  const params = await Promise.resolve(searchParams);

  // Parse search params safely
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const customersData = await getCustomers({
    search,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your customers and their information
          </p>
        </div>
      </div>

      <CustomersTable
        initialData={customersData}
        searchParams={{
          search,
          page: String(page),
        }}
      />
    </div>
  );
}
