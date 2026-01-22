import { sendMessage, getMessages, markMessagesAsRead, getUnreadCount } from "../services/message.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";

export const sendMessageController = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    if (content.length > 2000) {
      return res.status(400).json({ message: "Message content is too long" });
    }

    const msg = await sendMessage(
      conversationId,
      req.user?.id,
      req.brand?.id,
      content.trim()
    );

    res.json(msg);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to send message" });
  }
};

export const fetchMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const cursor = req.query.cursor as string | undefined;

    const data = await getMessages(
      conversationId,
      cursor,
      20,
      req.user?.id,
      req.brand?.id
    );

    res.json(data);
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
};

export const markConversationRead = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    await markMessagesAsRead(
      conversationId,
      req.user?.id,
      req.brand?.id
    );

    res.json({ message: "Messages marked as read" });
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
};

export const fetchUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const count = await getUnreadCount(
      conversationId,
      req.user?.id,
      req.brand?.id
    );

    res.json({ unreadCount: count });
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
};
