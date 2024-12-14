import { Prisma } from "@prisma/client";

export interface StoreSettings {
  id: string;
  logoId: string | null;
  faviconId: string | null;
  themeId: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  currency: string;
  locale: string;
  timezone: string;
  socialLinks: Prisma.JsonValue;
  metaTags: Prisma.JsonValue;
  analytics: Prisma.JsonValue;
  features: Prisma.JsonValue;
  checkoutConfig: Prisma.JsonValue;
  shippingZones: Prisma.JsonValue;
  taxConfig: Prisma.JsonValue;
  paymentConfig: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
} 