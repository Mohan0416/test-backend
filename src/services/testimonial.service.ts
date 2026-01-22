import { prisma } from "../config/db";

export const createTestimonial = async (
  brandId: string,
  reviewId: string,
  title?: string
) => {
  const review = await prisma.brandReview.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.brandId !== brandId) {
    throw new Error("Invalid review");
  }

  return prisma.testimonial.create({
    data: {
      brandId,
      reviewId,
      title,
    },
  });
};

export const toggleTestimonial = async (id: string, isActive: boolean) => {
  return prisma.testimonial.update({
    where: { id },
    data: { isActive },
  });
};

export const deleteTestimonial = async (id: string) => {
  return prisma.testimonial.delete({ where: { id } });
};

export const getBrandTestimonials = async (brandId: string) => {
  return prisma.testimonial.findMany({
    where: { brandId, isActive: true },
    include: {
      review: {
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
