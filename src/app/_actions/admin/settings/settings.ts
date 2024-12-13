'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function updateSettings(data: any) {
  try {
    // Update store information
    const store = await prisma.store.findFirst();
    if (!store) {
      throw new Error("Store not found");
    }

    await prisma.store.update({
      where: { id: store.id },
      data: {
        name: data.storeName,
        description: data.description,
      },
    });

    // Update settings
    const settings = await prisma.settings.update({
      where: { id: data.id },
      data: {
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        socialLinks: data.socialLinks,
        metaTags: data.metaTags,
        analytics: data.analytics,
        currency: data.currency,
        locale: data.locale,
        timezone: data.timezone,
        features: data.features,
        checkoutConfig: data.checkoutConfig,
        shippingZones: data.shippingZones,
        taxConfig: data.taxConfig,
      },
      include: {
        theme: true,
      },
    });

    // Return combined data
    return {
      ...settings,
      theme: settings.theme,
      storeName: data.storeName,
      description: data.description,
    };
  } catch (error) {
    console.error("Error updating settings:", error);
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
