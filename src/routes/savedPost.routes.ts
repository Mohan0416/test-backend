import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  savePostController,
  unsavePostController,
  fetchSavedPosts,
} from "../controllers/savedPost.controller";

const router = Router();

router.post("/:postId/save", authMiddleware, savePostController);
router.delete("/:postId/save", authMiddleware, unsavePostController);
router.get("/", authMiddleware, fetchSavedPosts);

export default router;
