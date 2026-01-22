import { Router } from "express";
import {
  createForm,
  addField,
  deleteField,
  updateOrder,
  fetchForm,
} from "../controllers/leadForm.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createForm);
router.post("/field", authMiddleware, addField);
router.delete("/field/:fieldId", authMiddleware, deleteField);
router.put("/field/:fieldId/order", authMiddleware, updateOrder);
router.get("/post/:postId", fetchForm);

export default router;
