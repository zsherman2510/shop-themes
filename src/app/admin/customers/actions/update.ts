"use server";

import { prisma } from "@/lib/prisma";
import { CustomerResponse } from "./get";

export async function updateCustomer(
  id: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: string;
  }
) {
  try {
    if (data.email) {
      const existingCustomer = await prisma.customers.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (existingCustomer) {
        throw new Error("Customer with this email already exists");
      }
    }

    const customer = await prisma.customers.update({
      where: { id },
      data,
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

    return {
      ...customer,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + (order.total ? Number(order.total) : 0), 0),
    } as CustomerResponse;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
} 