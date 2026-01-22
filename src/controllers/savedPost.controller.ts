import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import {
  savePost,
  unsavePost,
  getSavedPosts,
} from "../services/savedPost.service";

export const savePostController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { postId } = req.params;

  try {
    await savePost(userId, postId);
    res.json({ message: "Post saved" });
  } catch {
    res.status(409).json({ message: "Post already saved" });
  }
};

export const unsavePostController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { postId } = req.params;

  await unsavePost(userId, postId);
  res.json({ message: "Post removed from saved" });
};

export const fetchSavedPosts = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const data = await getSavedPosts(userId);

  res.json(
    data.map(s => ({
      ...s.post,
      savedAt: s.createdAt,
    }))
  );
};
