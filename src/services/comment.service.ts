import { prisma } from "../config/db";
import { createNotification } from "./notification.service";
import { getIO } from "../socket";

export const createComment = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  if (!user) throw new Error("User not found");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, brandId: true },
  });

  if (!post) throw new Error("Post not found");

  let parentComment = null;

  if (parentId) {
    parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment || parentComment.postId !== postId) {
      throw new Error("Invalid parent comment");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      userId,
      postId,
      content,
      parentId: parentId || null,
    },
  });

  // Get updated comment count and emit to all clients
  const commentCount = await prisma.comment.count({ where: { postId } });
  getIO().emit("comment_created", { postId, commentCount, commentedByUserId: userId });

  if (!parentId && post.brandId) {
    await createNotification(
      undefined,
      post.brandId,
      "COMMENT",
      "New Comment",
      `${user.username} commented on your post`,
      postId,
      "POST"
    );
  }

  if (parentId && parentComment) {
    if (parentComment.userId !== userId) {
      await createNotification(
        parentComment.userId,
        undefined,
        "REPLY",
        "New Reply",
        `${user.username} replied to your comment`,
        postId,
        "POST"
      );
    }
  }

  return comment;
};

export const getPostComments = async (
  postId: string,
  limit: number,
  cursor?: string
) => {
  const cursorObj = cursor ? JSON.parse(cursor) : undefined;
  const cursorDate = cursorObj?.date ? new Date(cursorObj.date) : undefined;

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
      ...(cursorDate && { createdAt: { lt: cursorDate } }),
    },
    include: {
      user: { select: { id: true, username: true } },
      replies: {
        include: {
          user: { select: { id: true, username: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  });

  let nextCursor = null;

  if (comments.length > limit) {
    const last = comments.pop();
    nextCursor = JSON.stringify({
      date: last!.createdAt.toISOString(),
    });
  }

  return {
    data: comments,
    nextCursor,
  };
};


export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== userId) throw new Error("Unauthorized");

  return prisma.comment.delete({
    where: { id: commentId },
  });
};
