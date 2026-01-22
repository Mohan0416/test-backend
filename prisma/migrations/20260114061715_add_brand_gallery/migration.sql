-- CreateTable
CREATE TABLE "BrandGallery" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sizeInMB" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandGallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrandGallery_brandId_idx" ON "BrandGallery"("brandId");

-- AddForeignKey
ALTER TABLE "BrandGallery" ADD CONSTRAINT "BrandGallery_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
