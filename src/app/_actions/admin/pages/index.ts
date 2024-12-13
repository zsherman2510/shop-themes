"use server";

import { prisma } from "@/lib/prisma";
import { PageStatus, PageVisibility, Prisma } from "@prisma/client";
import { PageContent, PageDetails, GetPagesResponse } from "@/types/pages";

export async function getPages({
  search = "",
  status,
  page = 1,
  limit = 10,
}: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<GetPagesResponse> {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.PageWhereInput = {
      isSystem: true,
      ...(search && {
        title: { contains: search, mode: "insensitive" as Prisma.QueryMode },
      }),
      ...(status && { status: status as PageStatus }),
    };

    const [pages, count] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          updatedAt: true,
        },
      }),
      prisma.page.count({ where }),
    ]);

    return {
      pages,
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting pages:", error);
    throw new Error("Failed to get pages");
  }
}

export async function getPage(id: string): Promise<PageDetails> {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        sections: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            content: true,
            order: true,
            isActive: true,
          },
        },
      },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    return {
      id: page.id,
      title: page.title,
      content: page.content as unknown as PageContent,
      status: page.status,
    };
  } catch (error) {
    console.error("Error getting page:", error);
    throw new Error("Failed to get page");
  }
}

export async function updatePage(
  id: string,
  data: Partial<Pick<PageDetails, "content" | "title" | "status">>
) {
  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        status: data.status,
        content: data.content ? (data.content as unknown as Prisma.JsonObject) : undefined,
        updatedAt: new Date(),
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
    };
  } catch (error) {
    console.error("Error updating page:", error);
    throw new Error("Failed to update page");
  }
}

export async function initializeHomePage() {
  try {
    const existingHome = await prisma.page.findFirst({
      where: { slug: "home" },
    });

    if (!existingHome) {
      const content: PageContent = {
        hero: {
          title: "Welcome to Our Store",
          description: "Discover amazing products at great prices",
          cta: "Shop Now",
          image: "/placeholder.jpg",
        },
        featuredProducts: {
          title: "Featured Products",
          products: [],
        },
        categories: {
          title: "Shop by Category",
          categories: [],
        },
        newsletter: {
          title: "Subscribe to Our Newsletter",
          description: "Get the latest updates and special offers",
        },
      };

      await prisma.page.create({
        data: {
          title: "Home",
          slug: "home",
          content: content as unknown as Prisma.JsonObject,
          status: PageStatus.PUBLISHED,
          visibility: PageVisibility.PUBLIC,
          isSystem: true,
          layout: "FULL_WIDTH",
          sections: {
            create: [
              {
                type: "HERO",
                content: content.hero,
                order: 1,
              },
              {
                type: "FEATURED_PRODUCTS",
                content: content.featuredProducts,
                order: 2,
              },
              {
                type: "CATEGORY_SHOWCASE",
                content: content.categories,
                order: 3,
              },
              {
                type: "NEWSLETTER",
                content: content.newsletter,
                order: 4,
              },
            ],
          },
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error initializing home page:", error);
    throw new Error("Failed to initialize home page");
  }
}