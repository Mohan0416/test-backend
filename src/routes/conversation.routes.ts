import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { sendMessageController, fetchMessages,markConversationRead,fetchUnreadCount } from "../controllers/message.controller";
import { createConversation, fetchConversationList } from "../controllers/conversation.controller";

const router = Router()
router.post("/start", authMiddleware, createConversation);
router.get("/",authMiddleware, fetchConversationList)
router.post("/:conversationId/messages", authMiddleware, sendMessageController);
router.get("/:conversationId/messages", authMiddleware, fetchMessages);
router.post("/:conversationId/read", authMiddleware, markConversationRead);
router.get("/:conversationId/unread-count", authMiddleware, fetchUnreadCount);



export default router
