import { createServerClient } from "../supabase/server";

export async function getCurrentUser() {
  const supabase = createServerClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.user_metadata.role === "ADMIN";
}
