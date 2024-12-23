"use server";

import { prisma } from "@/lib/prisma";
import { Products, Prisma } from "@prisma/client";

export type ProductWithPrice = Omit<Products, 'price'> & {
  price: number;
  category?: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    image: string | null;
    parentId: string | null;
  } | null;
};

export async function getFeaturedProducts(): Promise<ProductWithPrice[]> {
  const products = await prisma.products.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
    },
    take: 4,
  });

  return products.map(({ price, ...rest }) => ({
    ...rest,
    price: price.toNumber(),
  })) as ProductWithPrice[];
}

export async function getProducts(): Promise<ProductWithPrice[]> {
  const products = await prisma.products.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map(({ price, ...rest }) => ({
    ...rest,
    price: price.toNumber(),
  })) as ProductWithPrice[];
}

export async function getProduct(productId: string): Promise<ProductWithPrice | null> {
  const product = await prisma.products.findFirst({
    where: {
      id: productId,
      isActive: true,
    },
    include: {
      category: true,
    },
  });

  if (!product) return null;

  const { price, ...rest } = product;
  return {
    ...rest,
    price: price.toNumber(),
  } as ProductWithPrice;
}

export async function getProductsByCategory(categoryId: string): Promise<ProductWithPrice[]> {
  const products = await prisma.products.findMany({
    where: {
      categoryId,
      isActive: true,
    },
    include: {
      category: true,
    },
  });

  return products.map(({ price, ...rest }) => ({
    ...rest,
    price: price.toNumber(),
  })) as ProductWithPrice[];
}