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
        <h2 className="text-lg font-medium text-base-content">
          {defaultValues ? "Edit User" : "Create User"}
        </h2>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading
            ? "Saving..."
            : defaultValues
              ? "Save Changes"
              : "Create User"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Basic Information</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role and Status */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Role and Status</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  {...register("role")}
                  className="select select-bordered w-full"
                >
                  <option value={UserRole.TEAM}>Team</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  {...register("status")}
                  className="select select-bordered w-full"
                >
                  <option value={UserStatus.ACTIVE}>Active</option>
                  <option value={UserStatus.INACTIVE}>Inactive</option>
                  <option value={UserStatus.BANNED}>Banned</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Permissions</h3>
            <div className="space-y-2">
              {Object.entries(TEAM_PERMISSIONS).map(([key, value]) => (
                <div key={key} className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">{key}</span>
                    <input
                      type="checkbox"
                      value={value}
                      {...register("permissions")}
                      className="checkbox"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
