"use server";

import { prisma } from "@/lib/prisma";
import { uploadImageToFirebase } from "@/lib/firebase/firebase";
import { PageContent } from "@/types/pages";
import { PageStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

interface CreatePageData {
  title: string;
  content: PageContent;
  file?: File;
}

export async function createPage(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Handle file upload
    const file = formData.get('file') as File | null;
    let fileUrl: string | undefined;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: "File size exceeds 50MB limit" };
      }

      fileUrl = await uploadImageToFirebase(file);
    }

    // Parse form data
    const data: CreatePageData = {
      title: formData.get('title') as string,
      content: JSON.parse(formData.get('content') as string) as PageContent,
    };

    console.log(data, 'data');
    // Validate required fields
    if (!data.title || !data.content) {
      return { success: false, error: "Missing required fields" };
    }

    // Create page
    const page = await prisma.pages.create({
      data: {
        title: data.title,
        content: {
          ...data.content,
          // Optionally add the uploaded file URL to the content
          hero: {
            ...data.content.hero,
            image: fileUrl, // Add the image URL to the hero section
          },
        } as unknown as Prisma.JsonObject, // Cast to Prisma.JsonObject
        status: PageStatus.DRAFT, // Default status
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
      },
    });

    return { success: true, data: page };
  } catch (error) {
    console.error("Error creating page:", error);
    return { success: false, error: "Something went wrong while creating the page" };
  }
} 