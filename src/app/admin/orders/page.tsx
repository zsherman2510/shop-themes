import { OrderStatus } from "@prisma/client";
import { getOrders } from "./actions/get";
import OrdersTable from "./components/OrderTable";

// Type for search params
type SearchParams = Promise<{
  search: string;
  status: string;
  page: string;
}>;

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  // Await and parse search params
  const { search, status, page } = await searchParams;

  // Fetch data server-side
  const ordersData = await getOrders({
    search,
    status: status as OrderStatus | undefined,
    page: Number(page),
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
