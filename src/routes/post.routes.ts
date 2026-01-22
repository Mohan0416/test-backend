import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createPostController, attachLeadFormController } from "../controllers/post.controller";
import { brandOnly } from "../middlewares/brand.middleware";

const router = Router()

router.post('/', authMiddleware, brandOnly, createPostController)
router.patch(
  "/:postId/lead-form",
  authMiddleware,
  brandOnly,
  attachLeadFormController
);


export default router