"use client";

import { Theme } from "@prisma/client";
import { useState } from "react";

interface Props {
  theme: Theme | null | undefined;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

interface ButtonStyles {
  fontSize: string;
  padding: string;
  borderRadius: string;
  [key: string]: string; // Allow additional button style properties
}

interface FormData {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonStyles: ButtonStyles;
  fontFamily: string;
}

export function AppearanceSettings({ theme, onSave, saving }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: theme?.name || "",
    primaryColor: theme?.primaryColor || "#000000",
    secondaryColor: theme?.secondaryColor || "#ffffff",
    accentColor: theme?.accentColor || "#3b82f6",
    backgroundColor: theme?.backgroundColor || "#ffffff",
    textColor: theme?.textColor || "#000000",
    fontFamily: theme?.fontFamily || "Inter",
    buttonStyles: (theme?.buttonStyles as ButtonStyles) || {
      fontSize: "0.875rem",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-medium">Theme Colors</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize your store's color scheme
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Primary Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="h-8 w-8 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Secondary Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="h-8 w-8 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Accent Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) =>
                  setFormData({ ...formData, accentColor: e.target.value })
                }
                className="h-8 w-8 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={formData.accentColor}
                onChange={(e) =>
                  setFormData({ ...formData, accentColor: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Text Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                className="h-8 w-8 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={formData.textColor}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-medium">Typography</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose your store's font settings
        </p>
        <div className="mt-6">
          <label className="block text-sm font-medium">Font Family</label>
          <select
            value={formData.fontFamily}
            onChange={(e) =>
              setFormData({ ...formData, fontFamily: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-medium">Button Styles</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize your store's button appearance
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Border Radius</label>
            <input
              type="text"
              value={formData.buttonStyles.borderRadius}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buttonStyles: {
                    ...formData.buttonStyles,
                    borderRadius: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Padding</label>
            <input
              type="text"
              value={formData.buttonStyles.padding}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buttonStyles: {
                    ...formData.buttonStyles,
                    padding: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Font Size</label>
            <input
              type="text"
              value={formData.buttonStyles.fontSize}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buttonStyles: {
                    ...formData.buttonStyles,
                    fontSize: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
