import { getCustomers } from "./actions/get";
import CustomersTable from "./components/CustomerTable";

// Type for search params
type SearchParams = Promise<{
  search: string;
  page: string;
}>;

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  // Await and parse search params
  const { search, page } = await searchParams;

  // Fetch data server-side
  const customersData = await getCustomers({
    search,
    page: Number(page),
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content">
            Customers
          </h1>
          <p className="text-sm text-base-content">
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
