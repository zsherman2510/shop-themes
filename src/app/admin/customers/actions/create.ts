"use server";

import { prisma } from "@/lib/prisma";
import { CustomerResponse } from "./get";

export async function createCustomer(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  try {
    const existingCustomer = await prisma.customers.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      throw new Error("Customer with this email already exists");
    }

    const customer = await prisma.customers.create({
      data: {
        ...data,
        status: "ACTIVE",
      },
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
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return {
      ...customer,
      orders: customer.orders.map(order => ({
        ...order,
        total: Number(order.total)
      })),
      orderCount: 0,
      totalSpent: 0,
      lastOrderDate: null,
    } as CustomerResponse;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
} 