"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { CustomerWithDetails } from "@/types/customers";

interface CustomersTableProps {
  initialData: {
    customers: CustomerWithDetails[];
    total: number;
    pages: number;
  };
  searchParams: {
    search?: string;
    hasOrders?: string;
    page?: string;
  };
}

export default function CustomersTable({
  initialData,
  searchParams,
}: CustomersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [hasOrdersValue, setHasOrdersValue] = useState(
    searchParams.hasOrders || ""
  );

  const currentPage = Number(searchParams.page) || 1;
  const hasOrders =
    searchParams.hasOrders === "true"
      ? true
      : searchParams.hasOrders === "false"
        ? false
        : undefined;

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
      hasOrders: hasOrders === undefined ? undefined : String(hasOrders),
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/customers?${queryString}`);
    });
  };

  const handleHasOrdersChange = (value: string) => {
    setHasOrdersValue(value);
    const queryString = createQueryString({
      search: searchValue || undefined,
      hasOrders: value === "" ? undefined : value,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/customers?${queryString}`);
    });
  };

  const handlePageChange = (page: number) => {
    const queryString = createQueryString({
      search: searchValue || undefined,
      hasOrders: hasOrders === undefined ? undefined : String(hasOrders),
      page: String(page),
    });

    startTransition(() => {
      router.push(`/dashboard/customers?${queryString}`);
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          />
          <select
            value={hasOrdersValue}
            onChange={(e) => handleHasOrdersChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value="">All Customers</option>
            <option value="true">Has Orders</option>
            <option value="false">No Orders</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Orders
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isPending ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : initialData.customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              initialData.customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{customer.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {customer._count.orders}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/customers/${customer.id}`)
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
          Showing {initialData.customers.length} of {initialData.total}{" "}
          customers
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
