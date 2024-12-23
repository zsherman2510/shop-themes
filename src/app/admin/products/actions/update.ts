"use server";

import { prisma } from "@/lib/prisma";
import { ProductResponse } from "./get";
import { uploadImageToFirebase } from "@/lib/firebase/firebase"; // Import your upload function
import { deleteImageFromFirebase } from "@/lib/firebase/firebase"; // Import the delete function

export async function updateProduct(id: string, formData: FormData) {
  try {
    // Convert FormData to object and handle special fields
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId") as string || null,
      isActive: formData.get("isActive") === "true",
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

    // Handle images
    const newImages: string[] = [];
    const oldImages: string[] = JSON.parse(formData.get("oldImages") as string) || []; // Get old images from form data
    const imagesToDelete: string[] = JSON.parse(formData.get("imagesToDelete") as string) || []; // Get images marked for deletion

    // Process new images
    const imageFiles = formData.getAll("images") as File[]; // Assuming images are sent as 'images' field
    for (const file of imageFiles) {
      if (file instanceof File) {
        const imageUrl = await uploadImageToFirebase(file); // Upload new image
        newImages.push(imageUrl);
      }
    }

    // Update product
    const product = await prisma.products.update({
      where: { id },
      data: {
        ...data,
        categoryId: data.categoryId || null,
        images: {
          set: oldImages.concat(newImages), // Combine old and new images
        },
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

    // Delete old images from storage
    for (const image of imagesToDelete) {
      await deleteImageFromFirebase(image); // Delete the image from storage
    }

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