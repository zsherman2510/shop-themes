import {
  DollarSign,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentOrders,
  revalidateDashboard,
} from "@/app/admin/dashboard/actions/dashboard";
import { getOrderStatusStyle } from "@/lib/utils/utils";

export default async function DashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
  ]);

  const statsConfig = [
    {
      title: "Total Sales",
      value: `$${Number(stats.totalSales).toLocaleString()}`,
      icon: DollarSign,
      change: stats.changes.sales,
      changeType:
        Number(stats.changes.sales) > 0
          ? "positive"
          : Number(stats.changes.sales) < 0
            ? "negative"
            : "neutral",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      change: stats.changes.orders,
      changeType:
        Number(stats.changes.orders) > 0
          ? "positive"
          : Number(stats.changes.orders) < 0
            ? "negative"
            : "neutral",
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      change: "0%",
      changeType: "neutral",
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      change: stats.changes.customers,
      changeType:
        Number(stats.changes.customers) > 0
          ? "positive"
          : Number(stats.changes.customers) < 0
            ? "negative"
            : "neutral",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={revalidateDashboard}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="text-gray-400" size={24} />
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b dark:border-gray-700">
                  <td className="py-3">#{order.id}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3">
                    ${Number(order.total).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
