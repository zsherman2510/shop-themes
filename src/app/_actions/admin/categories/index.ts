"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
} 