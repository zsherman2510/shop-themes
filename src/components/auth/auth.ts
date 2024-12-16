import { getServerSession } from "next-auth/next";
import { authOptions } from "./next-auth";
import { redirect } from "next/navigation";

export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function requireAuth() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

