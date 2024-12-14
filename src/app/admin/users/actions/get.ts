"use server";

import { prisma } from "@/lib/prisma";
import { AdminUserResponse } from "@/types/admin";
import { Prisma } from "@prisma/client";

export async function getUsers({
  search = "",
  role,
  page = 1,
  limit = 10,
}: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role: role as any }),
    };

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
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
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting users:", error);
    throw new Error("Failed to get users");
  }
}

export async function getUser(id: string): Promise<AdminUserResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
} 