"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { UserWithDetails } from "@/types/users";
import { UserRole } from "@prisma/client";

interface UsersTableProps {
  initialData: {
    users: UserWithDetails[];
    total: number;
    pages: number;
  };
  searchParams: {
    search?: string;
    role?: string;
    page?: string;
  };
}

export default function UsersTable({
  initialData,
  searchParams,
}: UsersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [roleValue, setRoleValue] = useState(searchParams.role || "");

  const currentPage = Number(searchParams.page) || 1;

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newSearchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    []
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const queryString = createQueryString({
      search: value || undefined,
      role: roleValue || undefined,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/users?${queryString}`);
    });
  };

  const handleRoleChange = (value: string) => {
    setRoleValue(value);
    const queryString = createQueryString({
      search: searchValue || undefined,
      role: value || undefined,
      page: "1",
    });

    startTransition(() => {
      router.push(`/dashboard/users?${queryString}`);
    });
  };

  const handlePageChange = (page: number) => {
    const queryString = createQueryString({
      search: searchValue || undefined,
      role: roleValue || undefined,
      page: String(page),
    });

    startTransition(() => {
      router.push(`/dashboard/users?${queryString}`);
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          />
          <select
            value={roleValue}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TEAM">Team Member</option>
          </select>
          <button
            onClick={() => router.push("/dashboard/users/new")}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* ... table header ... */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isPending ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : initialData.users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              initialData.users.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      className="invisible rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:visible dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {initialData.users.length} of {initialData.total} users
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === initialData.pages}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
