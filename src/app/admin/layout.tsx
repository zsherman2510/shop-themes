import AdminNav from "@/components/admin/navigation/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
