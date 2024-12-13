"use client";

import { useState } from "react";
import { Settings, Theme } from "@prisma/client";
import { AppearanceSettings } from "@/components/admin/settings/appearanceSettings";
import { GeneralSettings } from "@/components/admin/settings/generalSettings";
import { ShippingSettings } from "@/components/admin/settings/shippingSettings";
import { PaymentSettings } from "@/components/admin/settings/paymentSettings";
import {
  updateSettings,
  updateTheme,
  updateShipping,
  updatePayment,
} from "@/app/_actions/admin/settings/settings";

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

interface ShippingRate {
  id: string;
  name: string;
  price: number;
  minWeight?: number;
  maxWeight?: number;
  minOrder?: number;
  maxOrder?: number;
}

type SettingsWithRelations = Settings & {
  theme: Theme;
  storeName: string;
  description: string | null;
  shippingZones?: ShippingZone[];
};

interface SettingsContentProps {
  initialSettings: SettingsWithRelations;
}

export default function SettingsContent({
  initialSettings,
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] =
    useState<SettingsWithRelations>(initialSettings);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleThemeUpdate = async (themeData: any) => {
    if (!settings?.theme?.id) return;
    try {
      setSaving(true);
      setError(null);
      const updatedTheme = await updateTheme(settings.theme.id, themeData);
      setSettings((prev) => ({ ...prev, theme: updatedTheme }));
    } catch (error) {
      console.error("Error updating theme:", error);
      setError("Failed to update theme. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsUpdate = async (data: any) => {
    if (!settings?.id) return;
    try {
      setSaving(true);
      setError(null);
      const updatedData = await updateSettings({
        ...data,
        id: settings.id,
      });
      const parsedData: SettingsWithRelations = {
        ...updatedData,
        shippingZones: updatedData.shippingZones
          ? JSON.parse(updatedData.shippingZones as string)
          : [],
      };
      setSettings(parsedData);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleShippingUpdate = async (data: any) => {
    if (!settings?.id) return;
    try {
      setSaving(true);
      setError(null);
      const updatedData = await updateShipping({
        id: settings.id,
        shippingZones: data.shippingZones,
      });
      const parsedData: SettingsWithRelations = {
        ...updatedData,
        theme: updatedData.theme,
        storeName: updatedData.storeName,
        description: updatedData.description,
        shippingZones: updatedData.shippingZones
          ? JSON.parse(updatedData.shippingZones as string)
          : [],
      };
      setSettings(parsedData);
    } catch (error) {
      console.error("Error updating shipping:", error);
      setError("Failed to update shipping. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentUpdate = async (data: any) => {
    if (!settings?.id) return;
    try {
      setSaving(true);
      setError(null);
      const updatedData = await updatePayment({
        id: settings.id,
        paymentConfig: data.paymentConfig,
      });
      const parsedData: SettingsWithRelations = {
        ...updatedData,
        theme: updatedData.theme,
        storeName: updatedData.storeName,
        description: updatedData.description,
        shippingZones: updatedData.shippingZones
          ? JSON.parse(updatedData.shippingZones as string)
          : [],
      };
      setSettings(parsedData);
    } catch (error) {
      console.error("Error updating payment settings:", error);
      setError("Failed to update payment settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "general"
              ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "appearance"
              ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Appearance
        </button>
        <button
          onClick={() => setActiveTab("shipping")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "shipping"
              ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Shipping
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "payments"
              ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Payments
        </button>
      </div>

      <div className="py-4">
        {activeTab === "general" && (
          <GeneralSettings
            settings={settings}
            onSave={handleSettingsUpdate}
            saving={saving}
          />
        )}
        {activeTab === "appearance" && (
          <AppearanceSettings
            theme={settings?.theme}
            onSave={handleThemeUpdate}
            saving={saving}
          />
        )}
        {activeTab === "shipping" && (
          <ShippingSettings
            settings={{ shippingZones: settings?.shippingZones || [] }}
            onSave={handleShippingUpdate}
            saving={saving}
          />
        )}
        {activeTab === "payments" && (
          <PaymentSettings
            settings={settings}
            onSave={handlePaymentUpdate}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}
