"use client";

import { useRouter, usePathname } from "next/navigation";
import { AdminUserResponse } from "@/types/admin";
import { formatDate } from "@/lib/utils/";
import { UserRole, UserStatus } from "@prisma/client";

interface UserTableProps {
  initialData: {
    users: AdminUserResponse[];
    total: number;
    pageCount: number;
  };
  searchParams: {
    search?: string;
    role?: string;
    page?: string;
  };
}

export default function UserTable({
  initialData,
  searchParams,
}: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = async (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRoleFilter = async (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value !== "all") {
      params.set("role", value);
    } else {
      params.delete("role");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = async (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            defaultValue={searchParams.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          />
        </div>
        <select
          defaultValue={searchParams.role || "all"}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
        >
          <option value="all">All Roles</option>
          <option value={UserRole.TEAM}>Team</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {initialData.users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === UserStatus.ACTIVE
                          ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : user.status === UserStatus.INACTIVE
                            ? "bg-gray-50 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                            : "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {initialData.pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {initialData.total} users total
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: initialData.pageCount }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === Number(searchParams.page)}
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${
                    page === Number(searchParams.page)
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
