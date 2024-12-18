import AdminNav from "@/components/admin/navigation/AdminNav";
import { ThemeProvider } from "@/components/theme-provider";

import { redirect } from "next/navigation";
import { auth } from "@/components/auth/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-base-200">
        <AdminNav />
        <main className="flex-1 overflow-y-auto bg-base-200 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
