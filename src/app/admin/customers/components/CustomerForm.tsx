"use client";

import { useForm } from "react-hook-form";
import { CustomerResponse } from "../actions/get";

interface CustomerFormProps {
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: Partial<CustomerResponse>;
  isLoading?: boolean;
}

export default function CustomerForm({
  onSubmit,
  defaultValues,
  isLoading,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: defaultValues?.email || "",
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      phone: defaultValues?.phone || "",
      status: defaultValues?.status || "ACTIVE",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className={`input input-bordered w-full ${
            errors.email ? "input-error" : ""
          }`}
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.email.message}
            </span>
          </label>
        )}
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

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Phone</span>
        </label>
        <input
          type="tel"
          {...register("phone")}
          className="input input-bordered w-full"
        />
      </div>

      {defaultValues && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            {...register("status")}
            className="select select-bordered w-full"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading
            ? "Loading..."
            : defaultValues
              ? "Update Customer"
              : "Create Customer"}
        </button>
      </div>
    </form>
  );
}
