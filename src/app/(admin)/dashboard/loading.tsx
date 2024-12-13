import { StatsLoadingSkeleton } from "@/components/admin/dashboard/stats-skeleton";
import { OrdersLoadingSkeleton } from "@/components/admin/dashboard/orders-skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8 animate-pulse"></div>
      <StatsLoadingSkeleton />
      <OrdersLoadingSkeleton />
    </div>
  );
}
