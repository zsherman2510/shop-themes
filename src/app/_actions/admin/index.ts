"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const isAdminOrTeam = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const dbUser = await prisma.users.findUnique({
    where: {
      id: user.id
    },
    select: {
      role: true
    }
  });

  return dbUser?.role === "ADMIN" || dbUser?.role === "TEAM";
};
