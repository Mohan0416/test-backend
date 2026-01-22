import { Response, NextFunction } from "express";
import { AuthRequest } from './auth.middleware'

export const brandOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.brand || req.brand.role !== "BRAND") {
    return res.status(403).json({ message: "Only brands can perform this action" });
  }
  next();
};
