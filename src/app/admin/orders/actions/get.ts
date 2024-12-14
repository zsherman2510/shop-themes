"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";

export type OrderResponse = {
  id: string;
  orderNumber: string;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  status: OrderStatus;
  total: number;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getOrders({
  search = "",
  status,
  page = 1,
  limit = 10,
}: {
  search?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" } },
          {
            customer: {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        ],
      }),
      ...(status && { status }),
    };

    const [orders, count] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          customer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          status: true,
          total: true,
          paymentStatus: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.order.count({ where }),
    ]);

    const formattedOrders: OrderResponse[] = orders.map((order) => ({
      ...order,
      total: Number(order.total),
    }));

    return {
      orders: formattedOrders,
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting orders:", error);
    throw new Error("Failed to get orders");
  }
}

export async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        status: true,
        total: true,
        paymentStatus: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      ...order,
      total: Number(order.total),
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price),
      })),
    };
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
} 