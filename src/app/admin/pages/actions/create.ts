"use server";

import { prisma } from "@/lib/prisma";
import { PageContent, PageDetails } from "@/types/pages";
import { PageStatus, PageVisibility, Prisma } from "@prisma/client";

export async function createPage(data: {
  title: string;
  slug: string;
  content: PageContent;
  status?: PageStatus;
  isSystem?: boolean;
}) {
  try {
    const existingPage = await prisma.page.findUnique({
      where: { slug: data.slug },
    });

    if (existingPage) {
      throw new Error("Page with this slug already exists");
    }

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content as unknown as Prisma.JsonObject,
        status: data.status || PageStatus.DRAFT,
        visibility: PageVisibility.PUBLIC,
        isSystem: data.isSystem ?? false,
        sections: {
          create: [
            {
              type: "HERO",
              content: data.content.hero,
              order: 1,
            },
            {
              type: "FEATURED_PRODUCTS",
              content: data.content.featuredProducts,
              order: 2,
            },
            {
              type: "CATEGORY_SHOWCASE",
              content: data.content.categories,
              order: 3,
            },
            {
              type: "NEWSLETTER",
              content: data.content.newsletter,
              order: 4,
            },
          ],
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
      },
    });

    return {
      id: page.id,
      title: page.title,
      content: page.content as unknown as PageContent,
      status: page.status,
    } as PageDetails;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
} 