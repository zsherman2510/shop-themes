import { getCustomer } from "@/app/admin/customers/actions/get";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

type tParams = Promise<{ id: string }>;

export default async function CustomerPage({ params }: { params: tParams }) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "badge-success";
      case OrderStatus.PENDING:
        return "badge-warning";
      case OrderStatus.PROCESSING:
        return "badge-info";
      case OrderStatus.SHIPPED:
        return "badge-primary";
      case OrderStatus.CANCELLED:
        return "badge-error";
      case OrderStatus.REFUNDED:
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">Customer Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <div className="card bg-card shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="mt-1">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="hover:underline"
                  >
                    {customer.email}
                  </a>
                </div>
              </div>

              {customer.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${customer.phone}`}
                      className="hover:underline"
                    >
                      {customer.phone}
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Newsletter Subscription
                </label>
                <p className="mt-1">
                  <span
                    className={`badge ${
                      customer.isSubscribed ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {customer.isSubscribed ? "Subscribed" : "Not Subscribed"}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created At
                </label>
                <p className="mt-1">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="mt-1">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Summary */}
        <div className="card bg-card shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Orders Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold">{customer.orderCount}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold">
                  ${customer.totalSpent.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="card bg-card shadow md:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-lg">Order History</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders && customer.orders.length > 0 ? (
                    customer.orders.map((order) => (
                      <tr key={order.id} className="hover">
                        <td>#{order.id}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${getOrderStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
