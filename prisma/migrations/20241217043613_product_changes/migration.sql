/*
  Warnings:

  - You are about to drop the column `digitalProductId` on the `ProductDownloads` table. All the data in the column will be lost.
  - You are about to drop the column `digitalProductId` on the `ProductLicenses` table. All the data in the column will be lost.
  - You are about to drop the `DigitalProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportInfos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId]` on the table `ProductDownloads` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `ProductLicenses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ProductDownloads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductLicenses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DigitalProducts" DROP CONSTRAINT "DigitalProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDownloads" DROP CONSTRAINT "ProductDownloads_digitalProductId_fkey";

-- DropForeignKey
ALTER TABLE "ProductLicenses" DROP CONSTRAINT "ProductLicenses_digitalProductId_fkey";

-- DropForeignKey
ALTER TABLE "SupportInfos" DROP CONSTRAINT "SupportInfos_digitalProductId_fkey";

-- DropIndex
DROP INDEX "ProductDownloads_digitalProductId_idx";

-- DropIndex
DROP INDEX "ProductLicenses_digitalProductId_idx";

-- AlterTable
ALTER TABLE "ProductDownloads" DROP COLUMN "digitalProductId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductLicenses" DROP COLUMN "digitalProductId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "changelog" JSONB,
ADD COLUMN     "documentation" TEXT,
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "previewUrl" TEXT,
ADD COLUMN     "requirements" JSONB,
ADD COLUMN     "version" TEXT;

-- DropTable
DROP TABLE "DigitalProducts";

-- DropTable
DROP TABLE "SupportInfos";

-- CreateIndex
CREATE UNIQUE INDEX "ProductDownloads_productId_key" ON "ProductDownloads"("productId");

-- CreateIndex
CREATE INDEX "ProductDownloads_productId_idx" ON "ProductDownloads"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductLicenses_productId_key" ON "ProductLicenses"("productId");

-- CreateIndex
CREATE INDEX "ProductLicenses_productId_idx" ON "ProductLicenses"("productId");

-- AddForeignKey
ALTER TABLE "ProductDownloads" ADD CONSTRAINT "ProductDownloads_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLicenses" ADD CONSTRAINT "ProductLicenses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
