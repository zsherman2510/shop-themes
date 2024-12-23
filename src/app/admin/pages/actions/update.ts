"use server";

import { prisma } from "@/lib/prisma";
import { PageSection } from "@/types/pages";
import { uploadImageToFirebase } from "@/lib/firebase/firebase";
import { Prisma, SectionType } from "@prisma/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

interface UpdatePageData {
  title: string;
  sections: PageSection[];
  metaTitle?: string;
  metaDescription?: string;
  files?: Record<string, File>;
}

// Add type conversion helper
function convertToSectionType(type: string): SectionType {
  return type.toUpperCase() as SectionType;
}

export async function updatePage(formData: FormData, id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Parse form data
    const data: UpdatePageData = {
      title: formData.get('title') as string,
      sections: JSON.parse(formData.get('sections') as string) as PageSection[],
      metaTitle: (formData.get('metaTitle') as string) || undefined,
      metaDescription: (formData.get('metaDescription') as string) || undefined,
    };

    // Validate required fields
    if (!data.title || !data.sections) {
      return { success: false, error: "Missing required fields" };
    }

    // Handle file uploads for sections that contain images
    const processedSections = await Promise.all(
      data.sections.map(async (section) => {
        // Deep clone the section to avoid mutating the original
        const processedSection = { ...section, content: { ...section.content } };

        // Type guard to check if the section type supports images
        if (
          (section.type === 'hero' || section.type === 'banner') &&
          'image' in section.content &&
          section.content.image?.startsWith('data:')
        ) {
          try {
            const imageFile = await fetch(section.content.image).then(res => res.blob());
            const imageUrl = await uploadImageToFirebase(
              new File([imageFile], `${section.type}-image`, { type: imageFile.type })
            );
            // Now TypeScript knows this section type has an image property
            (processedSection.content as { image: string }).image = imageUrl;
          } catch (error) {
            console.error(`Error uploading ${section.type} image:`, error);
          }
        }

        return processedSection;
      })
    );

    // Update page with processed sections
    await prisma.pages.update({
      where: { id },
      data: {
        title: data.title,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        sections: {
          deleteMany: {}, // Remove all existing sections
          create: processedSections.map((section, index) => ({
            type: convertToSectionType(section.type),
            content: section.content as unknown as Prisma.JsonObject,
            isActive: section.isActive,
            order: section.order || index,
          })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating page:", error);
    return { success: false, error: "Something went wrong while updating the page" };
  }
} 