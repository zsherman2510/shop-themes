"use server";

import { prisma } from "@/lib/prisma";
import { StoreSettings } from "@/types/settings";

export async function getSettings(): Promise<StoreSettings> {
  try {
    const settings = await prisma.settings.findFirst({
      include: {
        logo: true,
        favicon: true,
        theme: true,
      },
    });

    if (!settings) {
      // First, create a default theme
      const defaultTheme = await prisma.themes.create({
        data: {
          name: "Default Theme",
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
          accentColor: "#3b82f6",
          backgroundColor: "#ffffff",
          textColor: "#000000",
          buttonStyles: {},
          fontFamily: "Inter",
        },
      });

      // Initialize default settings if none exist
      return await prisma.settings.create({
        data: {
          themeId: defaultTheme.id,
          contactEmail: null,
          contactPhone: null,
          address: null,
          currency: "USD",
          locale: "en",
          timezone: "UTC",
          socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
          },
          metaTags: {
            title: "",
            description: "",
            keywords: [],
          },
          analytics: {
            googleAnalytics: "",
            facebookPixel: "",
          },
          features: {
            reviews: true,
            wishlist: true,
            compare: true,
          },
          checkoutConfig: {
            guestCheckout: true,
            termsRequired: true,
          },
          shippingZones: {},
          taxConfig: {
            enabled: false,
            rate: 0,
          },
          paymentConfig: {
            stripe: {
              enabled: false,
              publicKey: "",
              secretKey: "",
            },
            paypal: {
              enabled: false,
              clientId: "",
              secretKey: "",
            },
          },
        },
        include: {
          logo: true,
          favicon: true,
          theme: true,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw new Error("Failed to get settings");
  }
} 