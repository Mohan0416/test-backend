import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createComment,
  getPostComments,
  deleteComment,
} from "../services/comment.service";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;

    const comment = await createComment(
      req.user!.id,
      postId,
      content,
      parentId
    );

    res.json(comment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const fetchPostComments = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { cursor, limit } = req.query;

    const comments = await getPostComments(
      postId,
      Number(limit) || 10,
      cursor as string | undefined
    );

    res.json(comments);
  } catch {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};


export const removeComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    await deleteComment(commentId, req.user!.id);
    res.json({ message: "Comment deleted" });
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
};
