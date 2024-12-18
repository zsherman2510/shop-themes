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
      <div className="form-control w-full">
        <label className="label" htmlFor="status">
          <span className="label-text">Order Status</span>
        </label>
        <select
          id="status"
          {...register("status")}
          className="select select-bordered w-full"
        >
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="paymentStatus">
          <span className="label-text">Payment Status</span>
        </label>
        <select
          id="paymentStatus"
          {...register("paymentStatus")}
          className="select select-bordered w-full"
        >
          {Object.values(PaymentStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="trackingNumber">
          <span className="label-text">Tracking Number</span>
        </label>
        <input
          type="text"
          id="trackingNumber"
          {...register("trackingNumber")}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="notes">
          <span className="label-text">Notes</span>
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Loading..." : "Update Order"}
        </button>
      </div>
    </form>
  );
}
