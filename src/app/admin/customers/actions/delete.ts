"use server";

import { prisma } from "@/lib/prisma";

export async function deleteCustomer(id: string) {
  try {
    // Check if customer has any orders
    const customerWithOrders = await prisma.customer.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!customerWithOrders) {
      throw new Error("Customer not found");
    }

    if (customerWithOrders._count.orders > 0) {
      // If customer has orders, just update their status to INACTIVE
      await prisma.customer.update({
        where: { id },
        data: {
          status: "INACTIVE",
        },
      });
    } else {
      // If customer has no orders, we can safely delete them
      await prisma.customer.delete({
        where: { id },
      });
    }

    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
} 