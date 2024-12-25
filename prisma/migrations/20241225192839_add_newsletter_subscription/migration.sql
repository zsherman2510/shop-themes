/*
  Warnings:

  - You are about to drop the column `status` on the `Customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "status",
ADD COLUMN     "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB;
