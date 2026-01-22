/*
  Warnings:

  - You are about to drop the column `ctaUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "ctaUrl",
ADD COLUMN     "appleMapsUrl" TEXT,
ADD COLUMN     "googleMapsUrl" TEXT;
