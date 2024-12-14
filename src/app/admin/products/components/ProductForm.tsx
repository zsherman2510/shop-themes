"use client";

import { useForm } from "react-hook-form";
import { ProductResponse } from "../actions/get";

interface ProductFormProps {
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: ProductResponse;
  isLoading?: boolean;
}

export default function ProductForm({
  onSubmit,
  defaultValues,
  isLoading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      sku: defaultValues?.sku || "",
      price: defaultValues?.price || 0,
      categoryId: defaultValues?.category?.id || "",
      inventory: defaultValues?.inventory || 0,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="sku"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          SKU
        </label>
        <input
          type="text"
          id="sku"
          {...register("sku", { required: "SKU is required" })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
        {errors.sku && (
          <p className="mt-1 text-sm text-red-500">{errors.sku.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be greater than 0" },
          })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="inventory"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Inventory
        </label>
        <input
          type="number"
          id="inventory"
          {...register("inventory", {
            required: "Inventory is required",
            min: { value: 0, message: "Inventory must be greater than 0" },
          })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
        {errors.inventory && (
          <p className="mt-1 text-sm text-red-500">
            {errors.inventory.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Category
        </label>
        <select
          id="categoryId"
          {...register("categoryId")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        >
          <option value="">Select a category</option>
          {/* TODO: Add categories from API */}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <label
          htmlFor="isActive"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Active
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isLoading
            ? "Loading..."
            : defaultValues
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
