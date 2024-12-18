"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, ProductType } from "@prisma/client";

export type ProductResponse = {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  } | null;
  inventory: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: ProductType;
  // Digital product fields
  fileUrl: string | null;
  previewUrl: string | null;
  version: string | null;
  features: string[];
  documentation: string | null;
  changelog: any | null;
  requirements: any | null;
};

export async function getProducts({
  search = "",
  categoryId,
  page = 1,
  limit = 10,
}: {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductsWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categoryId && { categoryId }),
    };

    const [products, count] = await Promise.all([
      prisma.products.findMany({
        where,
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
          type: true,
          fileUrl: true,
          previewUrl: true,
          version: true,
          features: true,
          documentation: true,
          changelog: true,
          requirements: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.products.count({ where }),
    ]);

    const formattedProducts: ProductResponse[] = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return {
      products: formattedProducts,
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting products:", error);
    throw new Error("Failed to get products");
  }
}

// Admin version - Full details
export async function getAdminProduct(id: string) {
  try {
    const product = await prisma.products.findUnique({
      where: { id },
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
        metadata: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        fileUrl: true,
        previewUrl: true,
        version: true,
        features: true,
        documentation: true,
        changelog: true,
        requirements: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      ...product,
      price: Number(product.price),
    };
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}