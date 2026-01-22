import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { searchController } from "../controllers/search.controller";

const router = Router();

router.get("/", authMiddleware, searchController);

export default router;
