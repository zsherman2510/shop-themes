"use server";

import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus, Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import { AdminUserResponse } from "@/types/admin";

export async function getAdminUsers({
  search = "",
  role,
  page = 1,
  limit = 10,
}: {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: {
        in: [UserRole.ADMIN, UserRole.TEAM],
      },
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role }),
    };

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total: count,
      pageCount: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting admin users:", error);
    throw new Error("Failed to get admin users");
  }
}

export async function createAdminUser({
  email,
  password,
  firstName,
  lastName,
  role,
  permissions = [],
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  permissions?: string[];
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create Supabase auth user
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        firstName,
        lastName,
        role,
        permissions,
        status: UserStatus.ACTIVE,
      },
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

    return user;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

export async function updateAdminUser(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    status?: UserStatus;
    permissions?: string[];
    password?: string;
  }
) {
  try {
    // Update password if provided
    if (data.password) {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.admin.updateUserById(
        id,
        { password: data.password }
      );

      if (authError) {
        throw new Error(authError.message);
      }
    }

    // Remove password from database update
    const { password, ...dbData } = data;

    const user = await prisma.user.update({
      where: { id },
      data: dbData,
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

    return user;
  } catch (error) {
    console.error("Error updating admin user:", error);
    throw error;
  }
}

export async function deleteAdminUser(id: string) {
  try {
    // Check if user exists and is not an admin
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === UserRole.ADMIN) {
      throw new Error("Cannot delete admin users");
    }

    // Delete from Supabase auth
    const supabase = createClient();
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      throw new Error(authError.message);
    }

    // Delete from database
    await prisma.user.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Error deleting admin user:", error);
    throw error;
  }
}