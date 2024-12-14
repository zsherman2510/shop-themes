"use server";

import { prisma } from "@/lib/prisma";
import { AdminUserResponse } from "@/types/admin";
import { revalidatePath } from "next/cache";
import { UserRole, UserStatus } from "@prisma/client";

interface UpdateUserData {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  permissions?: string[];
}

export async function updateUser({
  id,
  ...data
}: UpdateUserData): Promise<AdminUserResponse> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        permissions: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);

    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
} 