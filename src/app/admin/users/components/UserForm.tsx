"use client";

import { useForm } from "react-hook-form";
import { AdminUserResponse, TEAM_PERMISSIONS } from "@/types/admin";
import { updateUser } from "../actions/update";
import { useRouter } from "next/navigation";
import { UserRole, UserStatus } from "@prisma/client";

interface UserFormProps {
  defaultValues?: AdminUserResponse;
  isLoading?: boolean;
}

export default function UserForm({ defaultValues, isLoading }: UserFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm({
    defaultValues: {
      email: defaultValues?.email || "",
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      role: defaultValues?.role || UserRole.TEAM,
      status: defaultValues?.status || UserStatus.ACTIVE,
      permissions: defaultValues?.permissions || [],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (!defaultValues?.id) return;
      await updateUser({
        id: defaultValues.id,
        ...data,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {defaultValues ? "Edit User" : "Create User"}
        </h2>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isLoading
            ? "Saving..."
            : defaultValues
              ? "Save Changes"
              : "Create User"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Role and Status */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Role and Status</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Role</label>
              <select
                {...register("role")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value={UserRole.TEAM}>Team</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value={UserStatus.ACTIVE}>Active</option>
                <option value={UserStatus.INACTIVE}>Inactive</option>
                <option value={UserStatus.BANNED}>Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Permissions</h3>
          <div className="space-y-2">
            {Object.entries(TEAM_PERMISSIONS).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={value}
                  {...register("permissions")}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:focus:ring-gray-100"
                />
                <label className="text-sm font-medium">{key}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
