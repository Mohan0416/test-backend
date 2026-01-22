import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userOnly } from "../middlewares/user.middleware";
import { likePost, unlikePost, getLikeCount } from "../controllers/like.controller";

const router = Router()

router.post('/:postId',authMiddleware, userOnly, likePost)
router.delete("/:postId",authMiddleware, userOnly, unlikePost)
router.get("/:postId/count", authMiddleware, getLikeCount);

export default router