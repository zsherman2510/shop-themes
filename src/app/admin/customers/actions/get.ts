"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";

export type CustomerResponse = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  orders?: {
    id: string;
    total: number;
    status: OrderStatus;
    createdAt: Date;
  }[];
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
    const skip = (page - 1) * limit || 0;
    const take = limit || 10;

    const where: Prisma.CustomersWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [customers, count] = await Promise.all([
      prisma.customers.findMany({
        where,
        include: {
          orders: {
            select: {
              total: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.customers.count({ where }),
    ]);

    const formattedCustomers: CustomerResponse[] = customers.map(customer => ({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      phone: customer.phone,
      status: customer.status,
      orderCount: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + (order.total ? Number(order.total) : 0), 0),
      lastOrderDate: customer.orders[0]?.createdAt ?? null,
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

export async function getCustomer(id: string): Promise<CustomerResponse> {
  try {
    const customer = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      status: customer.status,
      orderCount: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.total), 0),
      lastOrderDate: customer.orders[0]?.createdAt ?? null,
      orders: customer.orders.map(order => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error getting customer:", error);
    throw error;
  }
} 