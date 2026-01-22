import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { brandOnly } from "../middlewares/brand.middleware";
import {
  uploadGallery,
  fetchBrandGallery,
  removeGalleryMedia,
} from "../controllers/gallery.controller";

const router = Router();

router.post("/", authMiddleware, brandOnly, uploadGallery);
router.get("/:brandId", fetchBrandGallery);
router.delete("/:id", authMiddleware, brandOnly, removeGalleryMedia);

export default router;
