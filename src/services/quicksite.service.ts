import { prisma } from "../config/db";

export const upsertQuicksite = async (
  brandId: string,
  data: any
) => {
  return prisma.quicksite.upsert({
    where: { brandId },
    update: data,
    create: {
      brandId,
      ...data,
    },
  });
};

export const getQuicksite = async (brandId: string) => {
  return prisma.quicksite.findUnique({
    where: { brandId },
  });
};
