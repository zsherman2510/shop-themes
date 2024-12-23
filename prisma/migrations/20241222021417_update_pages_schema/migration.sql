/*
  Warnings:

  - You are about to drop the column `isSystem` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `navigationLabel` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `navigationOrder` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `showInNavigation` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `changelog` on the `Products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pages" DROP CONSTRAINT "Pages_templateId_fkey";

-- DropIndex
DROP INDEX "Pages_slug_key";

-- AlterTable
ALTER TABLE "Pages" DROP COLUMN "isSystem",
DROP COLUMN "layout",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "navigationLabel",
DROP COLUMN "navigationOrder",
DROP COLUMN "ogImage",
DROP COLUMN "publishedAt",
DROP COLUMN "showInNavigation",
DROP COLUMN "slug",
DROP COLUMN "templateId",
DROP COLUMN "visibility";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "changelog";
