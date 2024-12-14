"use client";

import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { CustomerResponse } from "../actions/get";
import { createCustomer, deleteCustomer, updateCustomer } from "../actions";
import CustomerModal from "./CustomerModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    CustomerResponse | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initialData);

  const handleCreateCustomer = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await createCustomer(formData);
      const updatedData = await fetch(
        `/api/customers?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating customer:", error);
      setError(error.message || "Failed to create customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (formData: any) => {
    if (!selectedCustomer) return;
    try {
      setIsLoading(true);
      setError(null);
      await updateCustomer(selectedCustomer.id, formData);
      const updatedData = await fetch(
        `/api/customers?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error updating customer:", error);
      setError(error.message || "Failed to update customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      setError(null);
      await deleteCustomer(id);
      const updatedData = await fetch(
        `/api/customers?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      setError(error.message || "Failed to delete customer. Please try again.");
    }
  };

  const openEditModal = (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedCustomer(undefined);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Spent
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
              {data.customers.map((customer) => (
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
                  <td className="px-4 py-3 text-sm">{customer.phone || "-"}</td>
                  <td className="px-4 py-3 text-sm">{customer.totalOrders}</td>
                  <td className="px-4 py-3 text-sm">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        customer.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(customer)}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(undefined);
          setError(null);
        }}
        onSubmit={
          selectedCustomer ? handleUpdateCustomer : handleCreateCustomer
        }
        customer={selectedCustomer}
        isLoading={isLoading}
      />
    </>
  );
}
