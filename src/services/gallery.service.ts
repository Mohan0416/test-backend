import { prisma } from "../config/db";
import { MediaType } from "@prisma/client";

interface GalleryInput {
  brandId: string;
  type: MediaType;
  url: string;
  width?: number;
  height?: number;
  sizeInMB?: number;
  order?: number;
}

export const uploadGalleryMedia = async (data: GalleryInput) => {
  return prisma.brandGallery.create({
    data: {
      brandId: data.brandId,
      type: data.type,
      url: data.url,
      width: data.width,
      height: data.height,
      sizeInMB: data.sizeInMB,
      order: data.order ?? 0,
    },
  });
};

export const getBrandGallery = async (brandId: string) => {
  return prisma.brandGallery.findMany({
    where: { brandId },
    orderBy: { order: "asc" },
  });
};

export const deleteGalleryMedia = async (
  galleryId: string,
  brandId: string
) => {
  const item = await prisma.brandGallery.findUnique({
    where: { id: galleryId },
  });

  if (!item || item.brandId !== brandId) {
    throw new Error("Unauthorized");
  }

  return prisma.brandGallery.delete({
    where: { id: galleryId },
  });
};
