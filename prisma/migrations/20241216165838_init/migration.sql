-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER', 'TEAM');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "PageLayout" AS ENUM ('FULL_WIDTH', 'BOXED', 'SIDEBAR_LEFT', 'SIDEBAR_RIGHT');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'FEATURED_PRODUCTS', 'PRODUCT_GRID', 'TEXT_BLOCK', 'IMAGE_GALLERY', 'NEWSLETTER', 'TESTIMONIALS', 'CONTACT_FORM', 'CUSTOM_HTML', 'CATEGORY_SHOWCASE', 'BANNER', 'COUNTDOWN', 'SOCIAL_FEED', 'VIDEO', 'FAQ', 'PRICING_TABLE', 'TEAM_MEMBERS', 'BLOG_POSTS', 'ANNOUNCEMENT_BAR', 'COLLECTION_LIST', 'PROMOTION_BANNER', 'REVIEWS', 'SIZE_CHART', 'PRODUCT_COMPARISON', 'RELATED_PRODUCTS', 'RECENTLY_VIEWED', 'INSTAGRAM_FEED', 'STORE_LOCATOR');

-- CreateEnum
CREATE TYPE "NavigationType" AS ENUM ('ADMIN_SIDEBAR', 'MAIN_MENU', 'FOOTER_MENU', 'MOBILE_MENU');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('LANDING', 'HOME', 'PRODUCTS', 'PRODUCT_DETAIL', 'CATEGORY', 'CHECKOUT', 'CART', 'ACCOUNT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DigitalType" AS ENUM ('THEME', 'TEMPLATE', 'PLUGIN', 'ASSET_PACK', 'COMPONENT', 'APP');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('STANDARD', 'EXTENDED', 'UNLIMITED', 'TRIAL');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL', 'DIGITAL', 'SUBSCRIPTION');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "firstName" TEXT,
    "lastLogin" TIMESTAMP(3),
    "lastName" TEXT,
    "metadata" JSONB,
    "permissions" TEXT[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "storeId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TEAM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT,
    "logo" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "images" TEXT[],
    "categoryId" TEXT,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sku" TEXT NOT NULL,
    "type" "ProductType" NOT NULL DEFAULT 'PHYSICAL',

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total" DECIMAL(65,30) NOT NULL,
    "shippingAddressId" TEXT,
    "billingAddressId" TEXT,
    "paymentIntent" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "shippingMethod" TEXT,
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,
    "guestEmail" TEXT,
    "guestName" TEXT,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "street" TEXT NOT NULL,
    "apartment" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,
    "guestEmail" TEXT,
    "guestName" TEXT,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "logoId" TEXT,
    "faviconId" TEXT,
    "themeId" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "socialLinks" JSONB,
    "metaTags" JSONB,
    "analytics" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "features" JSONB,
    "checkoutConfig" JSONB,
    "shippingZones" JSONB,
    "taxConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentConfig" JSONB,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "buttonStyles" JSONB NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "layout" "PageLayout" NOT NULL DEFAULT 'FULL_WIDTH',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "showInNavigation" BOOLEAN NOT NULL DEFAULT true,
    "navigationLabel" TEXT,
    "navigationOrder" INTEGER,
    "visibility" "PageVisibility" NOT NULL DEFAULT 'PUBLIC',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "id" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "style" JSONB,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pageId" TEXT NOT NULL,
    "settings" JSONB,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "size" INTEGER NOT NULL,
    "mimeType" TEXT,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Navigations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NavigationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Navigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItems" (
    "id" TEXT NOT NULL,
    "navigationId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "link" TEXT,
    "order" INTEGER NOT NULL,
    "parentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "style" JSONB,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "sections" JSONB NOT NULL,
    "settings" JSONB,
    "thumbnail" TEXT,
    "type" "PageType" NOT NULL,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingZones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countries" TEXT[],
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingZones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingRates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "minWeight" DOUBLE PRECISION,
    "maxWeight" DOUBLE PRECISION,
    "minOrder" DOUBLE PRECISION,
    "maxOrder" DOUBLE PRECISION,
    "zoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingRates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalProducts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "DigitalType" NOT NULL DEFAULT 'THEME',
    "fileUrl" TEXT NOT NULL,
    "previewUrl" TEXT,
    "version" TEXT NOT NULL,
    "changelog" JSONB,
    "requirements" JSONB,
    "features" TEXT[],
    "documentation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportInfos" (
    "id" TEXT NOT NULL,
    "digitalProductId" TEXT NOT NULL,
    "supportEmail" TEXT,
    "supportUrl" TEXT,
    "supportPeriod" INTEGER,
    "includedSupport" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportInfos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDownloads" (
    "id" TEXT NOT NULL,
    "digitalProductId" TEXT NOT NULL,
    "customerId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDownloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductLicenses" (
    "id" TEXT NOT NULL,
    "digitalProductId" TEXT NOT NULL,
    "customerId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL DEFAULT 'STANDARD',
    "status" "LicenseStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "activationsLimit" INTEGER,
    "activationsCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductLicenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PageToPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PageToPermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_domain_key" ON "Stores"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Products_sku_key" ON "Products"("sku");

-- CreateIndex
CREATE INDEX "Products_categoryId_idx" ON "Products"("categoryId");

-- CreateIndex
CREATE INDEX "Products_sku_idx" ON "Products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_slug_key" ON "Categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_orderNumber_key" ON "Orders"("orderNumber");

-- CreateIndex
CREATE INDEX "Orders_customerId_idx" ON "Orders"("customerId");

-- CreateIndex
CREATE INDEX "Orders_status_idx" ON "Orders"("status");

-- CreateIndex
CREATE INDEX "Addresses_customerId_idx" ON "Addresses"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_logoId_key" ON "Settings"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_faviconId_key" ON "Settings"("faviconId");

-- CreateIndex
CREATE UNIQUE INDEX "Pages_slug_key" ON "Pages"("slug");

-- CreateIndex
CREATE INDEX "Sections_pageId_order_idx" ON "Sections"("pageId", "order");

-- CreateIndex
CREATE INDEX "NavItems_navigationId_order_idx" ON "NavItems"("navigationId", "order");

-- CreateIndex
CREATE INDEX "ShippingZones_storeId_idx" ON "ShippingZones"("storeId");

-- CreateIndex
CREATE INDEX "ShippingRates_zoneId_idx" ON "ShippingRates"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProducts_productId_key" ON "DigitalProducts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportInfos_digitalProductId_key" ON "SupportInfos"("digitalProductId");

-- CreateIndex
CREATE INDEX "ProductDownloads_digitalProductId_idx" ON "ProductDownloads"("digitalProductId");

-- CreateIndex
CREATE INDEX "ProductDownloads_customerId_idx" ON "ProductDownloads"("customerId");

-- CreateIndex
CREATE INDEX "ProductDownloads_orderNumber_idx" ON "ProductDownloads"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProductLicenses_licenseKey_key" ON "ProductLicenses"("licenseKey");

-- CreateIndex
CREATE INDEX "ProductLicenses_digitalProductId_idx" ON "ProductLicenses"("digitalProductId");

-- CreateIndex
CREATE INDEX "ProductLicenses_customerId_idx" ON "ProductLicenses"("customerId");

-- CreateIndex
CREATE INDEX "ProductLicenses_orderNumber_idx" ON "ProductLicenses"("orderNumber");

-- CreateIndex
CREATE INDEX "_PageToPermission_B_index" ON "_PageToPermission"("B");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_faviconId_fkey" FOREIGN KEY ("faviconId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pages" ADD CONSTRAINT "Pages_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pages" ADD CONSTRAINT "Pages_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavItems" ADD CONSTRAINT "NavItems_navigationId_fkey" FOREIGN KEY ("navigationId") REFERENCES "Navigations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavItems" ADD CONSTRAINT "NavItems_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavItems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingZones" ADD CONSTRAINT "ShippingZones_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingRates" ADD CONSTRAINT "ShippingRates_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ShippingZones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalProducts" ADD CONSTRAINT "DigitalProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportInfos" ADD CONSTRAINT "SupportInfos_digitalProductId_fkey" FOREIGN KEY ("digitalProductId") REFERENCES "DigitalProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDownloads" ADD CONSTRAINT "ProductDownloads_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDownloads" ADD CONSTRAINT "ProductDownloads_digitalProductId_fkey" FOREIGN KEY ("digitalProductId") REFERENCES "DigitalProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLicenses" ADD CONSTRAINT "ProductLicenses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLicenses" ADD CONSTRAINT "ProductLicenses_digitalProductId_fkey" FOREIGN KEY ("digitalProductId") REFERENCES "DigitalProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToPermission" ADD CONSTRAINT "_PageToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "Pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToPermission" ADD CONSTRAINT "_PageToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
