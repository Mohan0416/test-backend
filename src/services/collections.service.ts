import { prisma } from "../config/db";

export const createCollection = async (userId: string, name: string) => {
  return prisma.collection.create({
    data: { userId, name },
  });
};

export const deleteCollection = async (userId: string, collectionId: string) => {
  return prisma.collection.deleteMany({
    where: { id: collectionId, userId },
  });
};

export const addPostToCollection = async (
  collectionId: string,
  postId: string
) => {
  return prisma.collectionItem.create({
    data: { collectionId, postId },
  });
};

export const removePostFromCollection = async (
  collectionId: string,
  postId: string
) => {
  return prisma.collectionItem.deleteMany({
    where: { collectionId, postId },
  });
};

export const getCollections = async (userId: string) => {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getCollectionPosts = async (collectionId: string) => {
  return prisma.collectionItem.findMany({
    where: { collectionId },
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
    orderBy: { createdAt: "desc" },
  });
};
