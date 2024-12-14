"use server";

import { prisma } from "@/lib/prisma/index";
import { StoreSettings } from "@/types/settings";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

type UpdateSettingsInput = Omit<Partial<StoreSettings>, 'createdAt' | 'updatedAt'>;

export async function updateSettings(data: UpdateSettingsInput): Promise<StoreSettings> {
  try {
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      throw new Error("Settings not found");
    }

    // Convert JSON fields to Prisma.JsonValue
    const updateData = {
      ...data,
      socialLinks: data.socialLinks as Prisma.InputJsonValue,
      metaTags: data.metaTags as Prisma.InputJsonValue,
      analytics: data.analytics as Prisma.InputJsonValue,
      features: data.features as Prisma.InputJsonValue,
      checkoutConfig: data.checkoutConfig as Prisma.InputJsonValue,
      shippingZones: data.shippingZones as Prisma.InputJsonValue,
      taxConfig: data.taxConfig as Prisma.InputJsonValue,
      paymentConfig: data.paymentConfig as Prisma.InputJsonValue,
    };

    const updatedSettings = await prisma.settings.update({
      where: { id: settings.id },
      data: updateData,
    });

    revalidatePath("/admin/settings");
    return updatedSettings;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }
} 

interface PaymentConfig {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  paymentMethods: {
    card: boolean;
    applePay: boolean;
    googlePay: boolean;
  };
}

export async function getSettings() {
  try {
    // Get both settings and store data
    const [settings, store] = await Promise.all([
      prisma.settings.findFirst({
        include: {
          theme: true,
        },
      }),
      prisma.store.findFirst(),
    ]);

    if (!settings) {
      throw new Error("Settings not found");
    }

    if (!store) {
      throw new Error("Store not found");
    }

    // Return combined data
    return {
      ...settings,
      storeName: store.name,
      description: store.description,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
}

export async function updateTheme(themeId: string, data: any) {
  try {
    const theme = await prisma.theme.update({
      where: { id: themeId },
      data: {
        name: data.name,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        buttonStyles: data.buttonStyles,
        fontFamily: data.fontFamily,
      },
    });
    return theme;
  } catch (error) {
    console.error("Error updating theme:", error);
    throw error;
  }
}

export async function updateShipping(data: { id: string; shippingZones: any }) {
  try {
    const [settings, store] = await Promise.all([
      prisma.settings.update({
        where: { id: data.id },
        data: {
          shippingZones: JSON.stringify(data.shippingZones),
        },
        include: {
          theme: true,
        },
      }),
      prisma.store.findFirst(),
    ]);

    if (!store) {
      throw new Error("Store not found");
    }

    return {
      ...settings,
      theme: settings.theme,
      storeName: store.name,
      description: store.description,
    };
  } catch (error) {
    console.error("Error updating shipping settings:", error);
    throw error;
  }
}

export async function updatePayment(data: { id: string; paymentConfig: PaymentConfig }) {
  try {
    const [settings, store] = await Promise.all([
      prisma.settings.update({
        where: { id: data.id },
        data: {
          paymentConfig: JSON.stringify(data.paymentConfig),
        },
        include: {
          theme: true,
        },
      }),
      prisma.store.findFirst(),
    ]);

    if (!store) {
      throw new Error("Store not found");
    }

    return {
      ...settings,
      theme: settings.theme,
      storeName: store.name,
      description: store.description,
    };
  } catch (error) {
    console.error("Error updating payment settings:", error);
    throw error;
  }
}
