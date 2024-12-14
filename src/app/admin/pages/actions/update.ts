"use server";

import { prisma } from "@/lib/prisma";
import { PageContent, PageDetails } from "@/types/pages";
import { PageStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
export async function updatePage({
  id,
  title,
  content,
  status,
}: {
  id: string;
  title: string;
  content: PageContent;
  status: PageStatus;
}): Promise<PageDetails> {
  try {
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title,
        content: content as unknown as Prisma.JsonObject,
        status,
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
      },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${id}`);

    return {
      id: updatedPage.id,
      title: updatedPage.title,
      content: updatedPage.content as unknown as PageContent,
      status: updatedPage.status,
    };
  } catch (error) {
    console.error("Error updating page:", error);
    throw new Error("Failed to update page");
  }
} 