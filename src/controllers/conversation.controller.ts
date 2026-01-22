import { startConversation, getConversationList } from "../services/conversation.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";

export const createConversation = async (req: AuthRequest, res: Response) => {
  const { userId, brandId } = req.body;

  const convo = await startConversation(userId, brandId);

  res.json(convo);
};

export const fetchConversationList = async (req: AuthRequest, res: Response) => {

  const conversations = await getConversationList(
    req.user?.id,
    req.brand?.id
  );

  res.json(conversations);
};
