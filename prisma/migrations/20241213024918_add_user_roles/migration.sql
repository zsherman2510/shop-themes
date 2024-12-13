-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'TEAM';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
