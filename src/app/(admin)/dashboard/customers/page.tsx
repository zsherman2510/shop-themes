import { getCustomers } from "@/app/_actions/admin/customers";
import CustomersTable from "@/components/admin/dashboard/tables/customers-table";

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
  const hasOrders =
    params.hasOrders === "true"
      ? true
      : params.hasOrders === "false"
        ? false
        : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const customersData = await getCustomers({
    search,
    hasOrders,
    page,
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your customers and their orders
        </p>
      </div>

      <CustomersTable
        initialData={customersData}
        searchParams={{
          search,
          hasOrders: hasOrders?.toString(),
          page: String(page),
        }}
      />
    </div>
  );
}
