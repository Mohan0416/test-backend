import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createCollectionController,
  deleteCollectionController,
  addPostController,
  removePostController,
  fetchCollectionsController,
  fetchCollectionPostsController,
} from "../controllers/collections.controller";

const router = Router();

router.post("/", authMiddleware, createCollectionController);
router.get("/", authMiddleware, fetchCollectionsController);
router.delete("/:collectionId", authMiddleware, deleteCollectionController);

router.post("/:collectionId/posts/:postId", authMiddleware, addPostController);
router.delete("/:collectionId/posts/:postId", authMiddleware, removePostController);

router.get("/:collectionId/posts", authMiddleware, fetchCollectionPostsController);

export default router;
