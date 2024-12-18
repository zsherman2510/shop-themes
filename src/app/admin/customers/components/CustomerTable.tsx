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
          className="btn btn-primary btn-sm gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="card bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-base-content/70">Customer Details</th>
                <th className="text-base-content/70">Email</th>
                <th className="text-base-content/70">Phone</th>
                <th className="text-base-content/70">Orders</th>
                <th className="text-base-content/70">Total Spent</th>
                <th className="text-base-content/70">Status</th>
                <th className="text-base-content/70">Actions</th>
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
                      {customer.phone || "-"}
                    </td>
                    <td className="text-base-content/70">
                      {customer.totalOrders}
                    </td>
                    <td className="text-base-content/70">
                      ${customer.totalSpent.toFixed(2)}
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
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="btn btn-ghost btn-sm btn-square text-error"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
