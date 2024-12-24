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
        <h1 className="text-2xl font-bold text-base-content">Dashboard</h1>
        <form action={revalidateDashboard}>
          <button type="submit" className="btn btn-neutral btn-sm gap-2">
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
              className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="text-base-content/50" size={24} />
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-success"
                      : stat.changeType === "negative"
                        ? "text-error"
                        : "text-base-content/70"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1 text-base-content">
                {stat.value}
              </h3>
              <p className="text-base-content/70 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-base-100 rounded-xl shadow-sm p-6 border border-base-200">
        <h2 className="text-lg font-semibold mb-4 text-base-content">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="font-medium">Order ID</th>
                <th className="font-medium">Customer</th>
                <th className="font-medium">Total</th>
                <th className="font-medium">Status</th>
                <th className="font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>${Number(order.total).toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "SHIPPED"
                          ? "badge-success"
                          : order.status === "PENDING"
                            ? "badge-warning"
                            : order.status === "CANCELLED"
                              ? "badge-error"
                              : "badge-info"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
