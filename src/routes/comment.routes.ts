import { Router } from "express";
import {
  addComment,
  fetchPostComments,
  removeComment,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/posts/:postId/comments", authMiddleware, addComment);
router.get("/posts/:postId/comments", authMiddleware, fetchPostComments);
router.delete("/comments/:commentId", authMiddleware, removeComment);

export default router;
