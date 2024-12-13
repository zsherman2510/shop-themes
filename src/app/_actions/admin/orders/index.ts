"use server";

import { PrismaClient, Prisma, OrderStatus } from "@prisma/client";
import { OrderWithDetails } from "@/types/order";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";

const prisma = new PrismaClient();

// Function to revalidate orders cache
export async function revalidateOrders() {
  revalidateTag('orders');
}

// Cache the orders data for 1 minute
export const getOrders = unstable_cache(
  async (params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const { search, status, page = 1, limit = 10 } = params;
      const skip = (page - 1) * limit;

      const where: Prisma.OrderWhereInput = {
        AND: [
          search
            ? {
                OR: [
                  { orderNumber: { contains: search, mode: "insensitive" } },
                  { user: { 
                      OR: [
                        { firstName: { contains: search, mode: "insensitive" } },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                      ]
                    } 
                  },
                ],
              }
            : {},
          status ? { status: status as OrderStatus } : {},
        ],
      };

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return {
      orders: orders as OrderWithDetails[],
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
},
  ['orders'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['orders']
  }
);