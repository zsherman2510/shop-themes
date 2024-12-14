"use server";

import { prisma } from "@/lib/prisma";

export async function deleteProduct(id: string) {
  try {
    // Check if product has any orders
    const productWithOrders = await prisma.product.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!productWithOrders) {
      throw new Error("Product not found");
    }

    if (productWithOrders._count.orderItems > 0) {
      // If product has orders, just update its status to inactive
      await prisma.product.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
    } else {
      // If product has no orders, we can safely delete it
      await prisma.product.delete({
        where: { id },
      });
    }

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
} 