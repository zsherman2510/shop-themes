"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminUserResponse } from "@/types/admin";
import { formatDate } from "@/lib/utils/";
import { UserRole, UserStatus } from "@prisma/client";
import UserModal from "./UserModal";
import { createUser } from "../actions/create";

interface UserTableProps {
  initialData: {
    users: AdminUserResponse[];
    total: number;
    pageCount: number;
  };
  searchParams: {
    search?: string;
    role?: UserRole;
    page?: string;
  };
}

export default function UserTable({
  initialData,
  searchParams,
}: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initialData);

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

  const handleRoleFilter = async (value: UserRole | "all") => {
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

  const handleCreateUser = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await createUser(formData);
      const updatedData = await fetch(
        `/admin/users?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <input
            type="text"
            placeholder="Search users..."
            defaultValue={searchParams.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered w-full"
          />
          <select
            defaultValue={searchParams.role || "all"}
            onChange={(e) =>
              handleRoleFilter(e.target.value as UserRole | "all")
            }
            className="select select-bordered w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value={UserRole.TEAM}>Team</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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
              {data.users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-base-content/60">
                    No users found.
                  </td>
                </tr>
              ) : (
                data.users
                  .filter(
                    (user) =>
                      user.role === UserRole.ADMIN ||
                      user.role === UserRole.TEAM
                  )
                  .map((user) => (
                    <tr key={user.id} className="hover">
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

      {data.pageCount > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-base-content/60">
            {data.total} users total
          </div>
          <div className="join">
            {Array.from({ length: data.pageCount }, (_, i) => i + 1).map(
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

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        onSubmit={handleCreateUser}
        isLoading={isLoading}
      />
    </div>
  );
}
