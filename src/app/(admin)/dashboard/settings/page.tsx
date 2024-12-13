import { getSettings } from "@/app/_actions/admin/settings/settings";
import SettingsContent from "@/components/admin/settings/SettingsContent";

export default async function SettingsPage() {
  // Fetch settings server-side
  const data = await getSettings();

  // Parse the data
  const parsedData = {
    ...data,
    storeName: data.storeName || "",
    description: data.description,
    shippingZones: data.shippingZones
      ? JSON.parse(data.shippingZones as string)
      : [],
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your store settings
        </p>
      </div>

      <SettingsContent initialSettings={parsedData} />
    </div>
  );
}
