import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const userOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "USER") {
    return res.status(403).json({ message: "Only users can perform this action" });
  }
  next();
};
