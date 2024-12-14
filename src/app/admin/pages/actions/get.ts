"use server";

import { prisma } from "@/lib/prisma";
import { PageStatus, Prisma } from "@prisma/client";
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
    throw error;
  }
}

export async function initializeHomePage() {
  try {
    // Check if home page exists
    const homePage = await prisma.page.findFirst({
      where: {
        slug: "home",
        isSystem: true,
      },
    });

    // If home page doesn't exist, create it
    if (!homePage) {
      await prisma.page.create({
        data: {
          title: "Home",
          slug: "home",
          status: "PUBLISHED",
          isSystem: true,
          content: {
            hero: {
              title: "Welcome to Our Store",
              description: "Discover our amazing products",
              cta: "Shop Now",
              image: "/images/hero.jpg",
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
              description: "Stay updated with our latest products and offers",
            },
          },
          sections: {
            create: [
              {
                type: "HERO",
                content: {
                  title: "Welcome to Our Store",
                  description: "Discover our amazing products",
                  cta: "Shop Now",
                  image: "/images/hero.jpg",
                },
                order: 1,
                isActive: true,
              },
              {
                type: "FEATURED_PRODUCTS",
                content: {
                  title: "Featured Products",
                  products: [],
                },
                order: 2,
                isActive: true,
              },
              {
                type: "CATEGORY_SHOWCASE",
                content: {
                  title: "Shop by Category",
                  categories: [],
                },
                order: 3,
                isActive: true,
              },
              {
                type: "NEWSLETTER",
                content: {
                  title: "Subscribe to Our Newsletter",
                  description: "Stay updated with our latest products and offers",
                },
                order: 4,
                isActive: true,
              },
            ],
          },
        },
      });
    }
  } catch (error) {
    console.error("Error initializing home page:", error);
    throw new Error("Failed to initialize home page");
  }
} 