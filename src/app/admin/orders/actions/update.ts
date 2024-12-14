"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { OrderResponse } from "./get";

export async function updateOrder(
  id: string,
  data: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    notes?: string;
  }
) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data,
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
    });

    return {
      ...order,
      total: Number(order.total),
    } as OrderResponse;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
} 