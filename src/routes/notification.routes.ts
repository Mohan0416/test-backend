import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fetchNotifications, markAllRead, unreadCount, markNotificationRead } from "../controllers/notification.controller";

const router = Router();

router.get("/", authMiddleware, fetchNotifications);
router.post("/read-all", authMiddleware, markAllRead);
router.post("/:notificationId/read", authMiddleware, markNotificationRead);
router.get("/unread-count", authMiddleware, unreadCount);


export default router;
