"use server";

import { prisma } from "@/lib/prisma";

export async function getProductsByCategory(categoryId: string) {
  return prisma.products.findMany({
    where: {
      categoryId,
      isActive: true,
    },
  });
}

export async function getProduct(productId: string) {
  return prisma.products.findFirst({
    where: {
      id: productId,
      isActive: true,
    },
    include: {
      category: true,
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.products.findMany({
    where: {
      isActive: true,
      // You might need to add a 'featured' field to your Products model
    },
    take: 4,
  });
}

// Add this to your existing products.ts file
export async function getProducts() {
  return prisma.products.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}