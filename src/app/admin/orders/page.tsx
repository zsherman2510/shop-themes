import { OrderStatus } from "@prisma/client";
import { getOrders } from "./actions/get";
import OrdersTable from "./components/OrderTable";

// Type for search params
type SearchParams = { [key: string]: string | string[] | undefined };

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  // Await and parse search params
  const params = await Promise.resolve(searchParams);

  // Parse search params safely
  const search = typeof params.search === "string" ? params.search : "";
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const ordersData = await getOrders({
    search,
    status: status as OrderStatus | undefined,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">
          Orders
        </h1>
        <p className="text-sm text-base-content/70">
          Manage your orders and their status
        </p>
      </div>

      <OrdersTable
        initialData={ordersData}
        searchParams={{
          search,
          status,
          page: String(page),
        }}
      />
    </div>
  );
}
