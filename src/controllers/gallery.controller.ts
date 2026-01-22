import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import {
  uploadGalleryMedia,
  getBrandGallery,
  deleteGalleryMedia,
} from "../services/gallery.service";

export const uploadGallery = async (req: AuthRequest, res: Response) => {
  const brandId = req.brand!.id;

  const media = await uploadGalleryMedia({
    brandId,
    ...req.body,
  });

  res.json(media);
};

export const fetchBrandGallery = async (req: AuthRequest, res: Response) => {
  const { brandId } = req.params;

  const data = await getBrandGallery(brandId);

  res.json(data);
};

export const removeGalleryMedia = async (req: AuthRequest, res: Response) => {
  const brandId = req.brand!.id;
  const { id } = req.params;

  await deleteGalleryMedia(id, brandId);

  res.json({ message: "Gallery item deleted" });
};
