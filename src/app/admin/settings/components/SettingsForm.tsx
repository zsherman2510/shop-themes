"use client";

import { useForm } from "react-hook-form";
import { StoreSettings } from "@/types/settings";
import { updateSettings } from "../actions/update";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  defaultValues?: StoreSettings;
  isLoading?: boolean;
}

export default function SettingsForm({
  defaultValues,
  isLoading,
}: SettingsFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contactEmail: defaultValues?.contactEmail || "",
      contactPhone: defaultValues?.contactPhone || "",
      address: defaultValues?.address || "",
      currency: defaultValues?.currency || "USD",
      locale: defaultValues?.locale || "en",
      timezone: defaultValues?.timezone || "UTC",
      socialLinks: defaultValues?.socialLinks || {
        facebook: "",
        twitter: "",
        instagram: "",
      },
      taxConfig: defaultValues?.taxConfig || {
        rate: 0,
        enabled: false,
      },
      shippingZones: defaultValues?.shippingZones || [],
      paymentConfig: defaultValues?.paymentConfig || {
        stripeEnabled: false,
        stripePublishableKey: "",
        stripeSecretKey: "",
      },
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateSettings(data);
      router.refresh();
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-base-content">
          Store Settings
        </h2>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Contact Information */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base-content">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Contact Email
                  </span>
                </label>
                <input
                  type="email"
                  {...register("contactEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`input input-bordered w-full ${
                    errors.contactEmail ? "input-error" : ""
                  }`}
                />
                {errors.contactEmail && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.contactEmail.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Contact Phone
                  </span>
                </label>
                <input
                  type="tel"
                  {...register("contactPhone")}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Address
                  </span>
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Regional Settings</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Currency
                  </span>
                </label>
                <select
                  {...register("currency")}
                  className="select select-bordered w-full"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Locale
                  </span>
                </label>
                <select
                  {...register("locale")}
                  className="select select-bordered w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Timezone
                  </span>
                </label>
                <select
                  {...register("timezone")}
                  className="select select-bordered w-full"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Social Links</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Facebook
                  </span>
                </label>
                <input
                  type="url"
                  {...register("socialLinks.facebook")}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Twitter</span>
                </label>
                <input
                  type="url"
                  {...register("socialLinks.twitter")}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Instagram
                  </span>
                </label>
                <input
                  type="url"
                  {...register("socialLinks.instagram")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base-content">Payment Settings</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-base-content/70">
                    Enable Stripe
                  </span>
                  <input
                    type="checkbox"
                    {...register("paymentConfig.stripeEnabled")}
                    className="checkbox"
                  />
                </label>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Stripe Publishable Key
                  </span>
                </label>
                <input
                  type="text"
                  {...register("paymentConfig.stripePublishableKey")}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Stripe Secret Key
                  </span>
                </label>
                <input
                  type="password"
                  {...register("paymentConfig.stripeSecretKey")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base-content">Tax Settings</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-base-content/70">
                    Enable Tax
                  </span>
                  <input
                    type="checkbox"
                    {...register("taxConfig.enabled")}
                    className="checkbox"
                  />
                </label>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Tax Rate (%)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("taxConfig.rate")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
