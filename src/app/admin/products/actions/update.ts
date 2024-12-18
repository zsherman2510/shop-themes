"use server";

import { prisma } from "@/lib/prisma";
import { ProductResponse } from "./get";

export async function updateProduct(id: string, formData: FormData) {
  try {
    // Convert FormData to object and handle special fields
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId") as string || null, // Handle empty string
      isActive: formData.get("isActive") === "true",
      previewUrl: formData.get("previewUrl") as string,
      version: formData.get("version") as string,
      features: JSON.parse(formData.get("features") as string),
      documentation: formData.get("documentation") as string,
    };

    // Validate SKU uniqueness
    if (data.sku) {
      const existingProduct = await prisma.products.findFirst({
        where: {
          sku: data.sku,
          NOT: { id },
        },
      });

      if (existingProduct) {
        return { error: "Product with this SKU already exists" };
      }
    }

    // Update product
    const product = await prisma.products.update({
      where: { id },
      data: {
        ...data,
        categoryId: data.categoryId || null, // Ensure null if empty string
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        ...product,
        price: Number(product.price),
      } as ProductResponse,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Failed to update product" };
  }
} 