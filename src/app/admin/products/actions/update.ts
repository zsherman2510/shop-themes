"use server";

import { prisma } from "@/lib/prisma";
import { ProductResponse } from "./get";

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    images?: string[];
    categoryId?: string | null;
    inventory?: number;
    isActive?: boolean;
    metadata?: any;
  }
) {
  try {
    if (data.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          NOT: { id },
        },
      });

      if (existingProduct) {
        throw new Error("Product with this SKU already exists");
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        sku: true,
        price: true,
        images: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        inventory: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...product,
      price: Number(product.price),
    } as ProductResponse;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
} 