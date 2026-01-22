-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Testimonial_brandId_idx" ON "Testimonial"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_reviewId_key" ON "Testimonial"("reviewId");

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "BrandReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
