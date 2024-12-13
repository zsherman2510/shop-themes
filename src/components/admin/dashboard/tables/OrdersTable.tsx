"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { formatPrice } from "@/lib/utils/utils";
import { OrderStatus } from "@prisma/client";
import { OrderWithDetails } from "@/types/order";

interface OrdersTableProps {
  initialData: {
    orders: OrderWithDetails[];
    total: number;
    pages: number;
  };
  searchParams: {
    search?: string;
    status?: string;
    page?: string;
  };
}

export default function OrdersTable({
  initialData,
  searchParams,
}: OrdersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const status = searchParams.status;

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
    const queryString = createQueryString({
      search: value || undefined,
      status: status || undefined,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/orders?${queryString}`);
    });
  };

  const handleStatusChange = (value: string) => {
    const queryString = createQueryString({
      search: search || undefined,
      status: value || undefined,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/orders?${queryString}`);
    });
  };

  const handlePageChange = (page: number) => {
    const queryString = createQueryString({
      search: search || undefined,
      status: status || undefined,
      page: String(page),
    });

    startTransition(() => {
      router.push(`/dashboard/orders?${queryString}`);
    });
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400";
      case "SHIPPED":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search orders..."
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          />
          <select
            defaultValue={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Total
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isPending ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : initialData.orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              initialData.orders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm">#{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {order.user?.firstName} {order.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/orders/${order.id}`)
                      }
                      className="invisible rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:visible dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      View
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
          Showing {initialData.orders.length} of {initialData.total} orders
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
