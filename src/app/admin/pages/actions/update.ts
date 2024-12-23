"use server";

import { prisma } from "@/lib/prisma";
import { PageContent } from "@/types/pages";
import { uploadImageToFirebase } from "@/lib/firebase/firebase"; // Import the upload function
import { Prisma } from "@prisma/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export async function updatePage(formData: FormData, id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Parse form data
    const data = {
      title: formData.get('title') as string,
      content: JSON.parse(formData.get('content') as string) as PageContent,
      file: formData.get('file') as File | null, // Get the file from form data
    };

    // Validate required fields
    if (!data.title || !data.content) {
      return { success: false, error: "Missing required fields" };
    }

    let fileUrl: string | undefined;

    // Handle file upload if a new file is provided
    if (data.file) {
      if (data.file.size > MAX_FILE_SIZE) {
        return { success: false, error: "File size exceeds 50MB limit" };
      }

      fileUrl = await uploadImageToFirebase(data.file);
      // Update the hero image in the content if applicable
      if (data.content.hero) {
        data.content.hero.image = fileUrl; // Update the hero image in the content
      }
    }

    // Update page
    await prisma.pages.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content as unknown as Prisma.JsonObject, // Cast to Prisma.JsonObject
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating page:", error);
    return { success: false, error: "Something went wrong while updating the page" };
  }
} 