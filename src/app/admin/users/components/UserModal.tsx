"use client";

import { useForm } from "react-hook-form";
import { UserRole } from "@prisma/client";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: UserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: UserRole.TEAM,
    },
  });

  const onSubmitForm = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) => {
    await onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New User</h3>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="input input-bordered w-full"
                placeholder="First Name"
              />
              {errors.firstName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.firstName.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                className="input input-bordered w-full"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.lastName.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="input input-bordered w-full"
              placeholder="Email"
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select {...register("role")} className="select select-bordered">
              <option value={UserRole.TEAM}>Team</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
