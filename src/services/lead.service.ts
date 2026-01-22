import { prisma } from "../config/db";

export const submitLeadForm = async (
  postId: string,
  formId: string,
  userId: string,
  answers: any
) => {

  const form = await prisma.leadForm.findUnique({
    where: { id: formId },
    include: { fields: true }
  });

  if (!form || form.postId !== postId) {
    throw new Error("Invalid form");
  }

  // Validation
  for (const field of form.fields) {
    if (field.isRequired && !answers[field.id]) {
      throw new Error(`Missing required field: ${field.label}`);
    }
  }

  return prisma.leadSubmission.create({
    data: {
      formId,
      postId,
      userId,
      answers
    }
  });
};

export const getLeadsForPost = async (postId: string) => {
  return prisma.leadSubmission.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {   
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};
