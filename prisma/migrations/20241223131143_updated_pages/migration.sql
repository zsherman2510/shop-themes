/*
  Warnings:

  - The values [IMAGE_GALLERY,COUNTDOWN,SOCIAL_FEED] on the enum `SectionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `settings` on the `Sections` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `Sections` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Sections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Pages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionType_new" AS ENUM ('HERO', 'FEATURED_PRODUCTS', 'CATEGORIES', 'NEWSLETTER', 'TEXT_BLOCK', 'PRODUCT_GRID', 'BANNER', 'PRODUCT_COMPARISON', 'RELATED_PRODUCTS', 'RECENTLY_VIEWED', 'INSTAGRAM_FEED', 'STORE_LOCATOR', 'TESTIMONIALS', 'CONTACT_FORM', 'CUSTOM_HTML', 'CATEGORY_SHOWCASE', 'ANNOUNCEMENT_BAR', 'COLLECTION_LIST', 'PROMOTION_BANNER', 'REVIEWS', 'SIZE_CHART', 'VIDEO', 'FAQ', 'PRICING_TABLE', 'TEAM_MEMBERS', 'BLOG_POSTS');
ALTER TABLE "Sections" ALTER COLUMN "type" TYPE "SectionType_new" USING ("type"::text::"SectionType_new");
ALTER TYPE "SectionType" RENAME TO "SectionType_old";
ALTER TYPE "SectionType_new" RENAME TO "SectionType";
DROP TYPE "SectionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Pages" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "layout" "PageLayout" NOT NULL DEFAULT 'FULL_WIDTH',
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "navigationLabel" TEXT,
ADD COLUMN     "navigationOrder" INTEGER,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "showInNavigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "visibility" "PageVisibility" NOT NULL DEFAULT 'PUBLIC',
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sections" DROP COLUMN "settings",
DROP COLUMN "style",
DROP COLUMN "title";

-- DropEnum
DROP TYPE "DigitalType";

-- CreateIndex
CREATE UNIQUE INDEX "Pages_slug_key" ON "Pages"("slug");

-- AddForeignKey
ALTER TABLE "Pages" ADD CONSTRAINT "Pages_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
