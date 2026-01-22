import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { brandOnly } from "../middlewares/brand.middleware";
import {
  addTestimonial,
  updateTestimonialStatus,
  removeTestimonial,
  fetchBrandTestimonials,
} from "../controllers/testimonial.controller";

const router = Router();

router.post("/", authMiddleware, brandOnly, addTestimonial);
router.put("/:id", authMiddleware, brandOnly, updateTestimonialStatus);
router.delete("/:id", authMiddleware, brandOnly, removeTestimonial);
router.get("/brand/:brandId", fetchBrandTestimonials);

export default router;
