import AdminNav from "@/components/admin/navigation/AdminNav";
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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <AdminNav />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
