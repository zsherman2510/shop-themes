import { getSettings } from "./actions/get";
import SettingsForm from "./components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your store settings
        </p>
      </div>

      <SettingsForm defaultValues={settings} />
    </div>
  );
}
