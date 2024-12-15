import { prisma } from "@/lib/prisma";

export type Category = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getCategories() {
  return prisma.categories.findMany({
    where: {
      // Add any filters you need
    },
    orderBy: {
      name: 'asc', // Optional: sort by name
    },
  });
}

export async function getCategory(slug: string) {
  return prisma.categories.findUnique({
    where: {
      slug,
    },
  });
}