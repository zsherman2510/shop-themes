"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { ProductWithCategory } from "@/types/product";

const prisma = new PrismaClient();

export async function getProducts(params: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { search, category, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category ? { categoryId: category } : {},
      ],
    };

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        sku: true,
        inventory: true,
        isActive: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return {
      products: products,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
