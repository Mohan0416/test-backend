import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  addReview,
  removeReview,
  fetchBrandReviews,
  fetchBrandRatingStats,
} from "../controllers/reviews.controller";

const router = Router();

router.post("/:brandId", authMiddleware, addReview);
router.delete("/:brandId", authMiddleware, removeReview);
router.get("/:brandId", fetchBrandReviews);
router.get("/:brandId/stats", fetchBrandRatingStats);

export default router;
