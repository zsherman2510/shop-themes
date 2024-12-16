'use server'

import { PrismaClient } from "@prisma/client";
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

const prisma = new PrismaClient();

// Revalidate dashboard data
export async function revalidateDashboard() {
  revalidateTag('dashboard-stats');
  revalidateTag('recent-orders');
}

// Cache dashboard stats for 5 minutes
export const getDashboardStats = unstable_cache(
  async () => {
    try {
      const totalSales = await prisma.orders.aggregate({
        _sum: {
          total: true,
        },
        where: {
          paymentStatus: "PAID",
        },
      });

      const totalOrders = await prisma.orders.count();

      const totalProducts = await prisma.products.count({
        where: {
          isActive: true,
        },
      });

      const totalCustomers = await prisma.user.count({
        where: {
          role: "CUSTOMER",
          status: "ACTIVE",
        },
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const previousSales = await prisma.orders.aggregate({
        _sum: {
          total: true,
        },
        where: {
          paymentStatus: "PAID",
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      const previousOrders = await prisma.orders.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      const previousCustomers = await prisma.user.count({
        where: {
          role: "CUSTOMER",
          status: "ACTIVE",
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      const salesChange = previousSales._sum.total 
        ? ((Number(totalSales._sum.total) - Number(previousSales._sum.total)) / Number(previousSales._sum.total) * 100).toFixed(1)
        : "0";

      const ordersChange = previousOrders
        ? (((totalOrders - previousOrders) / previousOrders) * 100).toFixed(1)
        : "0";

      const customersChange = previousCustomers
        ? (((totalCustomers - previousCustomers) / previousCustomers) * 100).toFixed(1)
        : "0";

      return {
        totalSales: totalSales._sum.total?.toString() || "0",
        totalOrders,
        totalProducts,
        totalCustomers,
        changes: {
          sales: `${salesChange}%`,
          orders: `${ordersChange}%`,
          customers: `${customersChange}%`,
        },
      };
    } catch (error) {
      console.error("[GET_DASHBOARD_STATS]", error);
      throw error;
    }
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['dashboard-stats']
  }
);

// Cache recent orders for 1 minute
export const getRecentOrders = unstable_cache(
  async () => {
    try {
      const orders = await prisma.orders.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          customer: true,
        },
      });

      return orders.map(order => ({
        id: order.orderNumber,
        customer: order.customerId ? `${order.customer?.firstName} ${order.customer?.lastName}` : "Guest",
        total: order.total ? order.total.toString() : "0",
        status: order.status,
        date: order.createdAt.toISOString().split("T")[0],
      }));
    } catch (error) {
      console.error("[GET_RECENT_ORDERS]", error);
      throw error;
    }
  },
  ['recent-orders'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['recent-orders']
  }
); 