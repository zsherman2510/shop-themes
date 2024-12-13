"use client";

import { Settings } from "@prisma/client";
import { useState } from "react";
import { JsonValue } from "@prisma/client/runtime/library";

interface Props {
  settings: Settings | null;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

interface PaymentConfig {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  currency: string;
  paymentMethods: {
    card: boolean;
    applePay: boolean;
    googlePay: boolean;
  };
}

function parsePaymentConfig(settings: Settings | null): PaymentConfig {
  const defaultConfig: PaymentConfig = {
    stripeEnabled: false,
    stripePublishableKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
    currency: "USD",
    paymentMethods: {
      card: true,
      applePay: false,
      googlePay: false,
    },
  };

  if (!settings?.paymentConfig) {
    return defaultConfig;
  }

  try {
    const config =
      typeof settings.paymentConfig === "string"
        ? JSON.parse(settings.paymentConfig)
        : settings.paymentConfig;

    return {
      stripeEnabled: config.stripeEnabled ?? defaultConfig.stripeEnabled,
      stripePublishableKey:
        config.stripePublishableKey ?? defaultConfig.stripePublishableKey,
      stripeSecretKey: config.stripeSecretKey ?? defaultConfig.stripeSecretKey,
      stripeWebhookSecret:
        config.stripeWebhookSecret ?? defaultConfig.stripeWebhookSecret,
      currency: settings.currency || defaultConfig.currency,
      paymentMethods: {
        card: config.paymentMethods?.card ?? defaultConfig.paymentMethods.card,
        applePay:
          config.paymentMethods?.applePay ??
          defaultConfig.paymentMethods.applePay,
        googlePay:
          config.paymentMethods?.googlePay ??
          defaultConfig.paymentMethods.googlePay,
      },
    };
  } catch (error) {
    console.error("Error parsing payment config:", error);
    return defaultConfig;
  }
}

export function PaymentSettings({ settings, onSave, saving }: Props) {
  const [formData, setFormData] = useState<PaymentConfig>(
    parsePaymentConfig(settings)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ paymentConfig: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Stripe Integration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your Stripe payment settings
            </p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.stripeEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, stripeEnabled: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800"></div>
              <span className="ml-3 text-sm font-medium">Enable Stripe</span>
            </label>
          </div>
        </div>

        {formData.stripeEnabled && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                value={formData.stripePublishableKey}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stripePublishableKey: e.target.value,
                  })
                }
                placeholder="pk_..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={formData.stripeSecretKey}
                onChange={(e) =>
                  setFormData({ ...formData, stripeSecretKey: e.target.value })
                }
                placeholder="sk_..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Stripe Webhook Secret
              </label>
              <input
                type="password"
                value={formData.stripeWebhookSecret}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stripeWebhookSecret: e.target.value,
                  })
                }
                placeholder="whsec_..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure accepted payment methods
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.paymentMethods.card}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethods: {
                    ...formData.paymentMethods,
                    card: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-gray-100"
            />
            <label className="ml-2 block text-sm">Credit/Debit Cards</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.paymentMethods.applePay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethods: {
                    ...formData.paymentMethods,
                    applePay: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-gray-100"
            />
            <label className="ml-2 block text-sm">Apple Pay</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.paymentMethods.googlePay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethods: {
                    ...formData.paymentMethods,
                    googlePay: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-gray-100"
            />
            <label className="ml-2 block text-sm">Google Pay</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
