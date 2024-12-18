import { getSettings } from "./actions/get";
import SettingsForm from "./components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">
          Settings
        </h1>
        <p className="text-sm text-base-content/70">
          Manage your store settings
        </p>
      </div>

      <SettingsForm defaultValues={settings} />
    </div>
  );
}
