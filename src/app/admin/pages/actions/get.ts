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
          status: true,
          updatedAt: true,
          content: true,
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
      return null;
    }

    return {
      id: page.id,
      title: page.title,
      content: page.content as unknown as PageContent,
      status: page.status,
    };
  } catch (error) {
    console.error("Error getting page:", error);
    return null;
  }
}

export async function initializeHomePage() {
  try {
    // Retrieve all pages
    const allPages = await prisma.pages.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        content: true,
        updatedAt: true,
      },
    });

    console.log("All pages retrieved:", allPages); // Log the retrieved pages for debugging

    return allPages; // Return the list of all pages
  } catch (error) {
    console.error("Error retrieving pages:", error);
    throw new Error("Failed to retrieve pages");
  }
} 