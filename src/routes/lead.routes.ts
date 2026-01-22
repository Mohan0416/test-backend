import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { submitLead, fetchLeadsForPost } from "../controllers/lead.controller";

const router = Router()

router.post("/:postId/forms/:formId/submit", authMiddleware, submitLead);
router.get("/:postId", authMiddleware, fetchLeadsForPost);


export default router
