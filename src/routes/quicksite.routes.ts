import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { brandOnly } from "../middlewares/brand.middleware";
import {
  saveQuicksite,
  fetchQuicksite,
} from "../controllers/quicksite.controller";

const router = Router();

router.post("/", authMiddleware, brandOnly, saveQuicksite);
router.get("/:brandId", fetchQuicksite);

export default router;
