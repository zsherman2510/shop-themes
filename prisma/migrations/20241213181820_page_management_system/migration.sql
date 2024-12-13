/*
  Warnings:

  - You are about to drop the column `animation` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `components` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `conditions` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `pageConfigId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the `PageConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PageConfigToPermission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pageId` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sections` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Template` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED');

-- DropForeignKey
ALTER TABLE "PageConfig" DROP CONSTRAINT "PageConfig_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_pageConfigId_fkey";

-- DropForeignKey
ALTER TABLE "_PageConfigToPermission" DROP CONSTRAINT "_PageConfigToPermission_A_fkey";

-- DropForeignKey
ALTER TABLE "_PageConfigToPermission" DROP CONSTRAINT "_PageConfigToPermission_B_fkey";

-- DropIndex
DROP INDEX "Section_pageConfigId_order_idx";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "animation",
DROP COLUMN "components",
DROP COLUMN "conditions",
DROP COLUMN "config",
DROP COLUMN "pageConfigId",
ADD COLUMN     "pageId" TEXT NOT NULL,
ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "content",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "sections" JSONB NOT NULL,
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "thumbnail" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "PageType" NOT NULL;

-- DropTable
DROP TABLE "PageConfig";

-- DropTable
DROP TABLE "_PageConfigToPermission";

-- CreateTable
CREATE TABLE "Page" (
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

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PageToPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PageToPermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "_PageToPermission_B_index" ON "_PageToPermission"("B");

-- CreateIndex
CREATE INDEX "Section_pageId_order_idx" ON "Section"("pageId", "order");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToPermission" ADD CONSTRAINT "_PageToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToPermission" ADD CONSTRAINT "_PageToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
