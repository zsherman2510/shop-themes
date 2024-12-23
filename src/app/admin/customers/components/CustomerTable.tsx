"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CustomerResponse } from "../actions/get";

// Helper function to format dates
const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

interface CustomersTableProps {
  initialData: {
    customers: CustomerResponse[];
    total: number;
    pageCount: number;
  };
  searchParams: {
    search?: string;
    page: string;
  };
}

export default function CustomersTable({
  initialData,
  searchParams,
}: CustomersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState(initialData);

  const handleSearch = async (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = async (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1">
          <input
            type="text"
            placeholder="Search customers..."
            defaultValue={searchParams.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-base-content/70">Customer Details</th>
                <th className="text-base-content/70">Email</th>
                <th className="text-base-content/70">Orders</th>
                <th className="text-base-content/70">Total Spent</th>
                <th className="text-base-content/70">Last Order</th>
                <th className="text-base-content/70">Status</th>
                <th className="text-base-content/70">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-base-content/70">
                    No customers found.
                  </td>
                </tr>
              ) : (
                data.customers.map((customer) => (
                  <tr key={customer.id} className="hover">
                    <td className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="text-base-content/70">{customer.email}</td>
                    <td className="text-base-content/70">
                      {customer.orderCount}
                    </td>
                    <td className="text-base-content/70">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="text-base-content/70">
                      {formatDate(customer.lastOrderDate)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          customer.status === "ACTIVE"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="text-base-content/70">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data.pageCount > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-base-content/60">
            {data.total} customers total
          </div>
          <div className="join">
            {Array.from({ length: data.pageCount }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === Number(searchParams.page)}
                  className={`btn btn-sm join-item ${
                    page === Number(searchParams.page)
                      ? "btn-active"
                      : "btn-ghost"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
