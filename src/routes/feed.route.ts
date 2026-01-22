import { Router } from "express";
import { getHomeFeedController, getProfileFeedController, getExploreFeedController } from "../controllers/feed.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.get('/',authMiddleware,getHomeFeedController)
router.get("/explore", authMiddleware, getExploreFeedController);
router.get("/profile/:brandId", authMiddleware, getProfileFeedController);

export default router