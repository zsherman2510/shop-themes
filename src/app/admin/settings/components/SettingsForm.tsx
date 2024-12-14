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
        <h2 className="text-lg font-medium">Store Settings</h2>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Contact Information */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Contact Email
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
                className={`w-full rounded-lg border ${errors.contactEmail ? "border-red-500" : "border-gray-200"} px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100`}
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Contact Phone
              </label>
              <input
                type="tel"
                {...register("contactPhone")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Address</label>
              <textarea
                {...register("address")}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Regional Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Currency</label>
              <select
                {...register("currency")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Locale</label>
              <select
                {...register("locale")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Timezone</label>
              <select
                {...register("timezone")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Social Links</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Facebook</label>
              <input
                type="url"
                {...register("socialLinks.facebook")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Twitter</label>
              <input
                type="url"
                {...register("socialLinks.twitter")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Instagram
              </label>
              <input
                type="url"
                {...register("socialLinks.instagram")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Payment Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("paymentConfig.stripeEnabled")}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:focus:ring-gray-100"
              />
              <label className="text-sm font-medium">Enable Stripe</label>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                {...register("paymentConfig.stripePublishableKey")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Stripe Secret Key
              </label>
              <input
                type="password"
                {...register("paymentConfig.stripeSecretKey")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Tax Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("taxConfig.enabled")}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:focus:ring-gray-100"
              />
              <label className="text-sm font-medium">Enable Tax</label>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("taxConfig.rate")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
