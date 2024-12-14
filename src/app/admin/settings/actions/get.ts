"use server";

import { prisma } from "@/lib/prisma";
import { StoreSettings } from "@/types/settings";

export async function getSettings(): Promise<StoreSettings> {
  try {
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      // Initialize default settings if none exist
      return await prisma.settings.create({
        data: {
          contactEmail: null,
          contactPhone: null,
          address: null,
          currency: "USD",
          locale: "en",
          timezone: "UTC",
          socialLinks: {},
          taxConfig: {},
          shippingZones: {},
          paymentConfig: {},
          themeId: "light",
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw new Error("Failed to get settings");
  }
} 