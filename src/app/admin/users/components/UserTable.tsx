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

  const getStatusBadgeClass = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "badge-success";
      case UserStatus.INACTIVE:
        return "badge-ghost";
      case UserStatus.BANNED:
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            defaultValue={searchParams.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <select
          defaultValue={searchParams.role || "all"}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="select select-bordered w-full sm:w-auto"
        >
          <option value="all">All Roles</option>
          <option value={UserRole.TEAM}>Team</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>
      </div>

      <div className="card bg-base-100">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-base-content/60">Name</th>
                <th className="text-base-content/60">Email</th>
                <th className="text-base-content/60">Role</th>
                <th className="text-base-content/60">Status</th>
                <th className="text-base-content/60">Joined</th>
              </tr>
            </thead>
            <tbody>
              {initialData.users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-base-content/60">
                    No users found.
                  </td>
                </tr>
              ) : (
                initialData.users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    className="hover cursor-pointer"
                  >
                    <td className="font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="text-base-content/70">{user.email}</td>
                    <td className="text-base-content/70">{user.role}</td>
                    <td>
                      <div
                        className={`badge ${getStatusBadgeClass(user.status)}`}
                      >
                        {user.status}
                      </div>
                    </td>
                    <td className="text-base-content/70">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {initialData.pageCount > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-base-content/60">
            {initialData.total} users total
          </div>
          <div className="join">
            {Array.from({ length: initialData.pageCount }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === Number(searchParams.page)}
                  className={`btn btn-sm join-item ${
                    page === Number(searchParams.page)
                      ? "btn-active"
                      : "btn-ghost"
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
