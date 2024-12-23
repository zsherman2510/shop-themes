"use server";

import { prisma } from "@/lib/prisma";
import { PageStatus, Prisma, SectionType as PrismaSectionType } from "@prisma/client";
import { PageDetails, GetPagesResponse, PageSection } from "@/types/pages";

// Helper function to convert section data to the correct type
function convertSection(section: {
  id: string;
  type: PrismaSectionType;
  content: any;
  isActive: boolean;
  order: number;
}): PageSection {
  const baseSection = {
    id: section.id,
    isActive: section.isActive,
    order: section.order,
  };

  switch (section.type) {
    case 'HERO':
      return {
        ...baseSection,
        type: 'hero',
        content: {
          title: section.content.title || '',
          description: section.content.description || '',
          ctaText: section.content.ctaText,
          ctaLink: section.content.ctaLink,
          image: section.content.image,
          overlayColor: section.content.overlayColor,
          textColor: section.content.textColor,
        },
      };
    case 'FEATURED_PRODUCTS':
      return {
        ...baseSection,
        type: 'featuredProducts',
        content: {
          title: section.content.title || '',
          productIds: section.content.productIds || [],
          displayCount: section.content.displayCount || 4,
        },
      };
    case 'CATEGORIES':
      return {
        ...baseSection,
        type: 'categories',
        content: {
          title: section.content.title || '',
          categoryIds: section.content.categoryIds || [],
          layout: section.content.layout || 'grid',
        },
      };
    default:
      // This ensures type safety by making sure we handle all section types
      throw new Error(`Unsupported section type: ${section.type}`);
  }
}

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

    const where: Prisma.PagesWhereInput = {
      ...(search && {
        title: { contains: search, mode: "insensitive" as Prisma.QueryMode },
      }),
      ...(status && { status: status as PageStatus }),
    };

    const [pages, count] = await Promise.all([
      prisma.pages.findMany({
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
      prisma.pages.count({ where }),
    ]);

    return {
      pages: pages || [],
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting pages:", error);
    return {
      pages: [],
      total: 0,
      pageCount: 0,
    };
  }
}

export async function getPage(id: string): Promise<PageDetails | null> {
  try {
    const page = await prisma.pages.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      return null;
    }

    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      sections: page.sections.map(convertSection),
      metaTitle: page.metaTitle || undefined,
      metaDescription: page.metaDescription || undefined,
    };
  } catch (error) {
    console.error("Error getting page:", error);
    return null;
  }
}

export async function initializeHomePage() {
  try {
    // Check if home page exists
    const homePage = await prisma.pages.findFirst({
      where: {
        slug: 'home',
        isSystem: true,
      },
    });

    // If home page doesn't exist, create it with default sections
    if (!homePage) {
      await prisma.pages.create({
        data: {
          title: 'Home',
          slug: 'home',
          status: PageStatus.PUBLISHED,
          isSystem: true,
          layout: 'FULL_WIDTH',
          showInNavigation: true,
          navigationLabel: 'Home',
          navigationOrder: 0,
          visibility: 'PUBLIC',
          sections: {
            create: [
              {
                type: PrismaSectionType.HERO,
                content: {
                  title: 'Welcome to Our Store',
                  description: 'Discover amazing products at great prices',
                  ctaText: 'Shop Now',
                  ctaLink: '/products',
                },
                order: 0,
                isActive: true,
              },
              {
                type: PrismaSectionType.FEATURED_PRODUCTS,
                content: {
                  title: 'Featured Products',
                  productIds: [],
                  displayCount: 4,
                },
                order: 1,
                isActive: true,
              },
              {
                type: PrismaSectionType.CATEGORIES,
                content: {
                  title: 'Shop by Category',
                  categoryIds: [],
                  layout: 'grid',
                },
                order: 2,
                isActive: true,
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