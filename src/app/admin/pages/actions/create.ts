"use server";

import { prisma } from "@/lib/prisma";
import { uploadImageToFirebase } from "@/lib/firebase/firebase";
import { PageSection, PageDetails } from "@/types/pages";
import { PageStatus, Prisma, SectionType } from "@prisma/client";
import slugify from 'slugify';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface CreatePageData {
  title: string;
  sections: PageSection[];
  status?: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
}

// Type conversion helper
function convertToSectionType(type: string): SectionType {
  return type.toUpperCase() as SectionType;
}

export async function createPage(formData: FormData): Promise<{ success: boolean; data?: PageDetails; error?: string }> {
  try {
    // Parse form data
    const data: CreatePageData = {
      title: formData.get('title') as string,
      sections: JSON.parse(formData.get('sections') as string) as PageSection[],
      status: (formData.get('status') as PageStatus) || PageStatus.DRAFT,
      metaTitle: (formData.get('metaTitle') as string) || undefined,
      metaDescription: (formData.get('metaDescription') as string) || undefined,
    };

    // Validate required fields
    if (!data.title || !data.sections) {
      return { success: false, error: "Missing required fields" };
    }

    // Generate slug from title
    const slug = slugify(data.title, { lower: true, strict: true });

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

    // Create page with processed sections
    const page = await prisma.pages.create({
      data: {
        title: data.title,
        slug,
        status: data.status,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        sections: {
          create: processedSections.map((section, index) => ({
            type: convertToSectionType(section.type),
            content: section.content as unknown as Prisma.JsonObject,
            isActive: section.isActive,
            order: section.order || index
          }))
        }
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    return { 
      success: true, 
      data: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        metaTitle: page.metaTitle || undefined,
        metaDescription: page.metaDescription || undefined,
        sections: page.sections as unknown as PageSection[]
      }
    };

  } catch (error) {
    console.error("Error creating page:", error);
    return { 
      success: false, 
      error: "Failed to create page" 
    };
  }
} 