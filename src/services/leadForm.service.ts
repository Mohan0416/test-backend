import { prisma } from "../config/db";
import { LeadFieldType } from "@prisma/client";

export const createLeadForm = async (postId: string, title?: string, intro?: string) => {
  return prisma.leadForm.create({
    data: {
      postId,
      title,
      intro,
    },
  });
};

export const addLeadFormField = async (
  formId: string,
  label: string,
  type: LeadFieldType,
  isRequired: boolean,
  options: string[],
  order: number
) => {
  return prisma.leadFormField.create({
    data: {
      formId,
      label,
      type,
      isRequired,
      options,
      order,
    },
  });
};

export const deleteLeadFormField = async (fieldId: string) => {
  return prisma.leadFormField.delete({
    where: { id: fieldId },
  });
};

export const updateFieldOrder = async (fieldId: string, order: number) => {
  return prisma.leadFormField.update({
    where: { id: fieldId },
    data: { order },
  });
};

export const getFormByPost = async (postId: string) => {
  return prisma.leadForm.findUnique({
    where: { postId },
    include: {
      fields: {
        orderBy: { order: "asc" },
      },
    },
  });
};
