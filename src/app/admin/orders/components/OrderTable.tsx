"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { OrderResponse } from "../actions/get";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { updateOrder } from "../actions/update";
import OrderModal from "./OrderModal";

interface OrdersTableProps {
  initialData: {
    orders: OrderResponse[];
    total: number;
    pageCount: number;
  };
  searchParams: {
    search?: string;
    status?: string;
    page: string;
  };
}

export default function OrdersTable({
  initialData,
  searchParams,
}: OrdersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    OrderResponse | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initialData);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
      case "DELIVERED":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      case "REFUNDED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "PAID":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "FAILED":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      case "REFUNDED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const handleUpdateOrder = async (formData: any) => {
    if (!selectedOrder) return;
    try {
      setIsLoading(true);
      setError(null);
      await updateOrder(selectedOrder.id, formData);
      const updatedData = await fetch(
        `/api/orders?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error updating order:", error);
      setError(error.message || "Failed to update order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <>
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
                  Order
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {data.orders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.orderNumber}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.customer ? (
                      <div>
                        <div>
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {order.customer.email}
                        </div>
                      </div>
                    ) : (
                      "Guest"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus as PaymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(order)}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(undefined);
          setError(null);
        }}
        onSubmit={handleUpdateOrder}
        order={selectedOrder}
        isLoading={isLoading}
      />
    </>
  );
}
