import { prisma } from "../config/db";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createNotification } from "../services/notification.service";
import { Response } from "express";
import { getIO } from "../socket";

export const likePost = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id; // guaranteed by userOnly middleware
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      brandId: true,
    },
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const like = await prisma.like.create({
      data: { userId, postId },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({ where: { postId } });

    // Emit to all connected clients
    getIO().emit("post_liked", { postId, likeCount, likedByUserId: userId });

    await createNotification(
      undefined,              // receiverUserId
      post.brandId,           // receiverBrandId
      "LIKE",
      "New Like",
      `${user.username} liked your post`,
      postId,
      "POST"
    );

    return res.json({
      message: "Post liked",
      like,
      likeCount,
    });

  } catch {
    return res.status(409).json({ message: "Post already liked" });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { postId } = req.params;

  await prisma.like.deleteMany({
    where: { userId, postId }
  });

  // Get updated like count
  const likeCount = await prisma.like.count({ where: { postId } });

  // Emit to all connected clients
  getIO().emit("post_unliked", { postId, likeCount, unlikedByUserId: userId });

  res.json({ message: "Post unliked", likeCount });
};

export const getLikeCount = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;

  const count = await prisma.like.count({
    where: { postId }
  });

  res.json({ postId, likeCount: count });
};
