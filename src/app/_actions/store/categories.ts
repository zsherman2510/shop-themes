"use server";

import { prisma } from "@/lib/prisma";
import { Products } from "@prisma/client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Products[];
}

interface GetCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getCategories({
  search = "",
  page = 1,
  limit = 10,
}: GetCategoriesParams = {}) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
  };

  const [categories, count] = await Promise.all([
    prisma.categories.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
    prisma.categories.count({ where }),
  ]);

  console.log(categories, "a");

  return {
    categories,
    total: count,
    pageCount: Math.ceil(count / limit),
  };
}

export async function getCategory(id: string) {
  return prisma.categories.findUnique({
    where: { id },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createCategory(data: {
  name: string;
  description?: string;
  image?: string;
  slug: string;
}) {
  return prisma.categories.create({
    data,
  });
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    slug?: string;
  }
) {
  return prisma.categories.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return prisma.categories.delete({
    where: { id },
  });
}