"use server";

import { PrismaClient, Prisma, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUsers(params: {
  search?: string;
  role?: UserRole | undefined;
  page?: number;
  limit?: number;
}) {
  try {
    const { search, role, page = 1, limit = 10 } = params || {};

    console.log(params, "params");
    const skip = (page - 1) * limit;

    let where: Prisma.UserWhereInput = {};

    // Handle role filtering
    if (role) {
      where.role = role;
    } else {
      where.role = { not: UserRole.CUSTOMER };
    }

    // Add search conditions if present
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    console.log('Query where clause:', where);

    const total = await prisma.user.count({ where });

    console.log("total", total);

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });
    console.log("users", users);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw error;
  }
}