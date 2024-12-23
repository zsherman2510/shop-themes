"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export async function createUser(data: CreateUserData) {
  try {
    const { email, firstName, lastName, role } = data;

    // Validate role
    if (role !== UserRole.ADMIN && role !== UserRole.TEAM) {
      throw new Error("Invalid role. Must be either ADMIN or TEAM");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        status: "ACTIVE",
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
} 