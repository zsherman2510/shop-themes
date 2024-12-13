import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import { Permission } from "./permissions";

export const getUser = cache(async () => {
  const supabase = createServerComponentClient({ cookies });
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      ...user,
      ...profile,
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
});

export async function isAdmin() {
  const user = await getUser();
  return user?.role === "ADMIN";
}

export async function hasPermission(permission: Permission) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") return false;
  return user.permissions.includes(permission);
}

export async function requireAdmin() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized. Admin access required.");
  }
}

export async function requirePermission(permission: Permission) {
  const hasRequired = await hasPermission(permission);
  if (!hasRequired) {
    throw new Error(`Unauthorized. Required permission: ${permission}`);
  }
}
