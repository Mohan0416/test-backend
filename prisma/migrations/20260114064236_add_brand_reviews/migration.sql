-- CreateTable
CREATE TABLE "BrandReview" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrandReview_brandId_idx" ON "BrandReview"("brandId");

-- CreateIndex
CREATE INDEX "BrandReview_userId_idx" ON "BrandReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandReview_brandId_userId_key" ON "BrandReview"("brandId", "userId");

-- AddForeignKey
ALTER TABLE "BrandReview" ADD CONSTRAINT "BrandReview_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandReview" ADD CONSTRAINT "BrandReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
