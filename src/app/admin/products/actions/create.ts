"use server";

import { prisma } from "@/lib/prisma";
import { ProductResponse } from "./get";

export async function createProduct(data: {
  name: string;
  description?: string;
  sku: string;
  price: number;
  images?: string[];
  categoryId?: string;
  inventory?: number;
  isActive?: boolean;
  metadata?: any;
}) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      throw new Error("Product with this SKU already exists");
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        images: data.images || [],
        inventory: data.inventory || 0,
        isActive: data.isActive ?? true,
      },
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
    console.error("Error creating product:", error);
    throw error;
  }
} 