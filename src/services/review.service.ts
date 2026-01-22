import { prisma } from "../config/db";

export const createOrUpdateReview = async (
  userId: string,
  brandId: string,
  rating: number,
  comment?: string
) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.brandReview.upsert({
    where: {
      brandId_userId: { brandId, userId },
    },
    update: {
      rating,
      comment,
    },
    create: {
      brandId,
      userId,
      rating,
      comment,
    },
  });
};

export const deleteReview = async (userId: string, brandId: string) => {
  return prisma.brandReview.delete({
    where: {
      brandId_userId: { brandId, userId },
    },
  });
};

export const getBrandReviews = async (brandId: string) => {
  return prisma.brandReview.findMany({
    where: { brandId },
    include: {
      user: {
        select: { id: true, username: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getBrandRatingStats = async (brandId: string) => {
  const result = await prisma.brandReview.aggregate({
    where: { brandId },
    _avg: { rating: true },
    _count: true,
  });

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count,
  };
};
