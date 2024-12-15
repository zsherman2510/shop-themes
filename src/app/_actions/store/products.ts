import { prisma } from "@/lib/prisma";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  categoryId: string | null;
  isActive: boolean;
  createdAt: Date;
  // ... other fields from your Prisma schema
};

export async function getProductsByCategory(categoryId: string) {
  return prisma.products.findMany({
    where: {
      categoryId,
      isActive: true,
    },
  });
}

export async function getProduct(productId: string) {
  return prisma.products.findUnique({
    where: {
      id: productId,
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