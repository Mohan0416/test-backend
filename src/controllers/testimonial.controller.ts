import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import {
  createTestimonial,
  toggleTestimonial,
  deleteTestimonial,
  getBrandTestimonials,
} from "../services/testimonial.service";

export const addTestimonial = async (req: AuthRequest, res: Response) => {
  const brandId = req.brand!.id;
  const { reviewId, title } = req.body;

  const t = await createTestimonial(brandId, reviewId, title);
  res.json(t);
};

export const updateTestimonialStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const t = await toggleTestimonial(id, isActive);
  res.json(t);
};

export const removeTestimonial = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deleteTestimonial(id);
  res.json({ message: "Deleted" });
};

export const fetchBrandTestimonials = async (req: AuthRequest, res: Response) => {
  const { brandId } = req.params;
  const data = await getBrandTestimonials(brandId);
  res.json(data);
};
