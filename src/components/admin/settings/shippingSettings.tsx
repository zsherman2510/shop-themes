"use client";

import { useState } from "react";

interface Props {
  settings: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

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

export function ShippingSettings({ settings, onSave, saving }: Props) {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(
    settings?.shippingZones || []
  );

  const addZone = () => {
    setShippingZones([
      ...shippingZones,
      {
        id: crypto.randomUUID(),
        name: "New Zone",
        countries: [],
        rates: [],
      },
    ]);
  };

  const removeZone = (zoneId: string) => {
    setShippingZones(shippingZones.filter((zone) => zone.id !== zoneId));
  };

  const updateZone = (zoneId: string, data: Partial<ShippingZone>) => {
    setShippingZones(
      shippingZones.map((zone) =>
        zone.id === zoneId ? { ...zone, ...data } : zone
      )
    );
  };

  const addRate = (zoneId: string) => {
    setShippingZones(
      shippingZones.map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              rates: [
                ...zone.rates,
                {
                  id: crypto.randomUUID(),
                  name: "New Rate",
                  price: 0,
                },
              ],
            }
          : zone
      )
    );
  };

  const removeRate = (zoneId: string, rateId: string) => {
    setShippingZones(
      shippingZones.map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              rates: zone.rates.filter((rate) => rate.id !== rateId),
            }
          : zone
      )
    );
  };

  const updateRate = (
    zoneId: string,
    rateId: string,
    data: Partial<ShippingRate>
  ) => {
    setShippingZones(
      shippingZones.map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              rates: zone.rates.map((rate) =>
                rate.id === rateId ? { ...rate, ...data } : rate
              ),
            }
          : zone
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ shippingZones });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Shipping Zones</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure shipping zones and rates
            </p>
          </div>
          <button
            type="button"
            onClick={addZone}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Add Zone
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {shippingZones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) =>
                    updateZone(zone.id, { name: e.target.value })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeZone(zone.id)}
                  className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove Zone
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Countries</label>
                <input
                  type="text"
                  value={zone.countries.join(", ")}
                  onChange={(e) =>
                    updateZone(zone.id, {
                      countries: e.target.value.split(",").map((c) => c.trim()),
                    })
                  }
                  placeholder="US, CA, MX"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Shipping Rates
                  </label>
                  <button
                    type="button"
                    onClick={() => addRate(zone.id)}
                    className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
                  >
                    Add Rate
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {zone.rates.map((rate) => (
                    <div
                      key={rate.id}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <input
                        type="text"
                        value={rate.name}
                        onChange={(e) =>
                          updateRate(zone.id, rate.id, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Rate Name"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
                      />
                      <input
                        type="number"
                        value={rate.price}
                        onChange={(e) =>
                          updateRate(zone.id, rate.id, {
                            price: parseFloat(e.target.value),
                          })
                        }
                        placeholder="Price"
                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeRate(zone.id, rate.id)}
                        className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
