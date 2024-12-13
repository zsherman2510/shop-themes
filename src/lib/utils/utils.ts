import { OrderStatus } from "@prisma/client";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
} 

export function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "COMPLETED":
      return "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400";
    case "CANCELLED":
      return "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
}

export const getOrderStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.PROCESSING:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.SHIPPED:
      return "bg-purple-100 text-purple-800";
    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-800";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    case OrderStatus.REFUNDED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};