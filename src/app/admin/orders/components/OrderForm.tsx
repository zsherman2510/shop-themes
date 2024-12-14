"use client";

import { useForm } from "react-hook-form";
import { OrderResponse } from "../actions/get";
import { OrderStatus, PaymentStatus } from "@prisma/client";

interface OrderFormProps {
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: OrderResponse;
  isLoading?: boolean;
}

export default function OrderForm({
  onSubmit,
  defaultValues,
  isLoading,
}: OrderFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      status: defaultValues?.status || OrderStatus.PENDING,
      paymentStatus: defaultValues?.paymentStatus || PaymentStatus.PENDING,
      trackingNumber: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Order Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        >
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="paymentStatus"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Payment Status
        </label>
        <select
          id="paymentStatus"
          {...register("paymentStatus")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        >
          {Object.values(PaymentStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="trackingNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Tracking Number
        </label>
        <input
          type="text"
          id="trackingNumber"
          {...register("trackingNumber")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Notes
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isLoading ? "Loading..." : "Update Order"}
        </button>
      </div>
    </form>
  );
}
