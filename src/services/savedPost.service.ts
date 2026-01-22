import { prisma } from "../config/db";

export const savePost = async (userId: string, postId: string) => {
  return prisma.savedPost.create({
    data: { userId, postId },
  });
};

export const unsavePost = async (userId: string, postId: string) => {
  return prisma.savedPost.deleteMany({
    where: { userId, postId },
  });
};

export const getSavedPosts = async (userId: string) => {
  return prisma.savedPost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          media: true,
          brand: {
            select: { id: true, name: true, username: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      },
    },
  });
};
