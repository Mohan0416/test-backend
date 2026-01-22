/*
  Warnings:

  - You are about to drop the column `objective` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MarketingObjective" AS ENUM ('AWARENESS', 'TRAFFIC', 'LEAD_GENERATION', 'CONVERSIONS', 'GET_DIRECTIONS', 'MESSAGING');

-- CreateEnum
CREATE TYPE "LeadFieldType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'PHONE', 'DROPDOWN', 'CHECKBOX', 'RADIO');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "objective",
ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "destinationUrl" TEXT,
ADD COLUMN     "marketingObjective" "MarketingObjective",
ADD COLUMN     "prefilledMessage" TEXT;

-- CreateTable
CREATE TABLE "LeadForm" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "title" TEXT,
    "intro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadFormField" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "LeadFieldType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER NOT NULL,

    CONSTRAINT "LeadFormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadForm_postId_key" ON "LeadForm"("postId");

-- CreateIndex
CREATE INDEX "LeadFormField_formId_idx" ON "LeadFormField"("formId");

-- AddForeignKey
ALTER TABLE "LeadForm" ADD CONSTRAINT "LeadForm_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadFormField" ADD CONSTRAINT "LeadFormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "LeadForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
