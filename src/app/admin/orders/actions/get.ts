"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus, PaymentStatus } from "@prisma/client";

export type OrderResponse = {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  guestName: string | null;
  guestEmail: string | null;
  status: OrderStatus;
  total: number;
  paymentStatus: PaymentStatus;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      sku: string;
      images: string[];
    };
  }[];
  shippingAddress: {
    id: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  billingAddress: {
    id: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
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
    const skip = (page - 1) * limit || 0;
    const take = limit || 10;

    const where: Prisma.OrdersWhereInput = {
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
      prisma.orders.findMany({
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
        take,
        skip,
      }),
      prisma.orders.count({ where }),
    ]);

    const formattedOrders: OrderResponse[] = orders.map((order) => ({
      ...order,
      total: Number(order.total),
    })) as OrderResponse[];

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
    const order = await prisma.orders.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        guestName: true,
        guestEmail: true,
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
                images: true,
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
    } as OrderResponse;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
} 