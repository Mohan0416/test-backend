import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import {
  createOrUpdateReview,
  deleteReview,
  getBrandReviews,
  getBrandRatingStats,
} from "../services/review.service";

export const addReview = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { brandId } = req.params;
  const { rating, comment } = req.body;

  const review = await createOrUpdateReview(userId, brandId, rating, comment);
  res.json(review);
};

export const removeReview = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { brandId } = req.params;

  await deleteReview(userId, brandId);
  res.json({ message: "Review deleted" });
};

export const fetchBrandReviews = async (req: AuthRequest, res: Response) => {
  const { brandId } = req.params;
  const reviews = await getBrandReviews(brandId);
  res.json(reviews);
};

export const fetchBrandRatingStats = async (req: AuthRequest, res: Response) => {
  const { brandId } = req.params;
  const stats = await getBrandRatingStats(brandId);
  res.json(stats);
};
