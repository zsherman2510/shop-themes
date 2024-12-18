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

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "badge-warning";
      case "PROCESSING":
        return "badge-info";
      case "SHIPPED":
        return "badge-secondary";
      case "DELIVERED":
        return "badge-success";
      case "CANCELLED":
        return "badge-error";
      case "REFUNDED":
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  const getPaymentStatusBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "badge-warning";
      case "PAID":
        return "badge-success";
      case "FAILED":
        return "badge-error";
      case "REFUNDED":
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  const handleUpdateOrder = async (formData: any) => {
    if (!selectedOrder) return;
    try {
      setIsLoading(true);
      setError(null);
      await updateOrder(selectedOrder.id, formData);
      const updatedData = await fetch(
        `/admin/orders?${new URLSearchParams(searchParams)}`
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
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      <div className="card bg-base-100">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-base-content/70">Order Number</th>
                <th className="text-base-content/70">Customer</th>
                <th className="text-base-content/70">Status</th>
                <th className="text-base-content/70">Payment</th>
                <th className="text-base-content/70">Total</th>
                <th className="text-base-content/70">Date</th>
                <th className="text-base-content/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-base-content/70">
                    No orders found.
                  </td>
                </tr>
              ) : (
                data.orders.map((order) => (
                  <tr key={order.id} className="hover">
                    <td className="font-medium">{order.orderNumber}</td>
                    <td>
                      {order.customer ? (
                        <div>
                          <div className="font-medium">
                            {order.customer.firstName} {order.customer.lastName}
                          </div>
                          <div className="text-sm text-base-content/60">
                            {order.customer.email}
                          </div>
                        </div>
                      ) : (
                        "Guest"
                      )}
                    </td>
                    <td>
                      <div
                        className={`badge ${getStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge ${getPaymentStatusBadgeClass(order.paymentStatus as PaymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="text-base-content/70">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="text-base-content/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => openEditModal(order)}
                        className="btn btn-ghost btn-sm btn-square"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
