"use server";

import { authOptions } from "@/components/auth/next-auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export const isAdminOrTeam = async () => {
  const session = await getServerSession(authOptions);
  
  const dbUser = await prisma.user.findUnique({
    where: {
      id: session?.user.id
    },
    select: {
      role: true
    }
  });

  return dbUser?.role === "ADMIN" || dbUser?.role === "TEAM";
};
