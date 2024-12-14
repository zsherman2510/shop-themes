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
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          {...register("firstName")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          {...register("lastName")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
      </div>

      {defaultValues && (
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
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
