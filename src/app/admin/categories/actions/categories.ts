"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
});

export async function createCategory(data: z.infer<typeof categorySchema>) {
  try {
    const validation = categorySchema.safeParse(data);
    
    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }

    const existingCategory = await prisma.categories.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      return { error: "A category with this slug already exists" };
    }

    const category = await prisma.categories.create({
      data: validation.data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    
    return { data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: z.infer<typeof categorySchema>
) {
  try {
    const validation = categorySchema.safeParse(data);
    
    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }

    const existingCategory = await prisma.categories.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });

    if (existingCategory) {
      return { error: "A category with this slug already exists" };
    }

    const category = await prisma.categories.update({
      where: { id },
      data: validation.data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    
    return { data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const productsCount = await prisma.products.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return { 
        error: "Cannot delete category with associated products. Please remove or reassign products first." 
      };
    }

    await prisma.categories.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}

export async function getCategoriesForAdmin() {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.categories.count();

    return {
      categories,
      total,
      pageCount: Math.ceil(total / 10) // Assuming 10 items per page
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}