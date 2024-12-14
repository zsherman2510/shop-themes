import { StatsLoadingSkeleton } from "@/components/loading/stats-skeleton";
import { OrdersLoadingSkeleton } from "@/components/loading/orders-skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8 animate-pulse"></div>
      <StatsLoadingSkeleton />
      <OrdersLoadingSkeleton />
    </div>
  );
}
