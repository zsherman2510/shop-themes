"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type CustomerResponse = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  totalOrders: number;
  totalSpent: number;
};

export async function getCustomers({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [customers, count] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          status: true,
          orders: {
            select: {
              total: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.customer.count({ where }),
    ]);

    const formattedCustomers: CustomerResponse[] = customers.map((customer) => ({
      ...customer,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + (order.total ? Number(order.total) : 0), 0),
    }));

    return {
      customers: formattedCustomers,
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting customers:", error);
    throw new Error("Failed to get customers");
  }
}

export async function getCustomer(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        orders: {
          select: {
            total: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return {
      ...customer,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + (order.total ? Number(order.total) : 0), 0),
    };
  } catch (error) {
    console.error("Error getting customer:", error);
    throw error;
  }
} 