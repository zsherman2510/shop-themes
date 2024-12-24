import { getOrder } from "@/app/admin/orders/actions/get";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, MapPin } from "lucide-react";
import Link from "next/link";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import Image from "next/image";

type tParams = Promise<{ id: string }>;

export default async function OrderPage({ params }: { params: tParams }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
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

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "badge-success";
      case PaymentStatus.PENDING:
        return "badge-warning";
      case PaymentStatus.FAILED:
        return "badge-error";
      case PaymentStatus.REFUNDED:
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  const formatAddress = (address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    return [
      address.line1,
      address.line2,
      `${address.city}, ${address.state} ${address.postalCode}`,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">Order Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Status */}
        <div className="card bg-card shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Order Status</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Order Status
                </label>
                <p className="mt-1">
                  <span
                    className={`badge ${getOrderStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Payment Status
                </label>
                <p className="mt-1">
                  <span
                    className={`badge ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created At
                </label>
                <p className="mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="mt-1">
                  {new Date(order.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="card bg-card shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Customer Information</h2>
            <div className="space-y-4">
              {order.customer ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <Link
                        href={`/admin/customers/${order.customer.id}`}
                        className="hover:underline"
                      >
                        {order.customer.firstName} {order.customer.lastName}
                      </Link>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${order.customer.email}`}
                        className="hover:underline"
                      >
                        {order.customer.email}
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Guest Name
                    </label>
                    <p className="mt-1">{order.guestName || "N/A"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Guest Email
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {order.guestEmail ? (
                        <a
                          href={`mailto:${order.guestEmail}`}
                          className="hover:underline"
                        >
                          {order.guestEmail}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Shipping Address
                  </label>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1" />
                    <p className="text-sm">
                      {formatAddress(order.shippingAddress)}
                    </p>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {order.billingAddress && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Billing Address
                  </label>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1" />
                    <p className="text-sm">
                      {formatAddress(order.billingAddress)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card bg-card shadow md:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-lg">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          {item.product.images?.[0] && (
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={3} className="text-right">
                      Total:
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
