import { prisma } from "../config/db";

export const startConversation = async (userId?: string, brandId?: string) => {
  if (!userId || !brandId) {
    throw new Error("Both participants required");
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      participants: {
        some: { userId: userId },
      },
      AND: {
        participants: {
          some: { brandId: brandId },
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId },
          { brandId },
        ],
      },
    },
  });
};




export const getConversationList = async (
  userId?: string,
  brandId?: string
) => {

  if (!userId && !brandId) {
    throw new Error("Identity missing");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          OR: [
            userId ? { userId } : undefined,
            brandId ? { brandId } : undefined,
          ].filter(Boolean) as any,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, username: true } },
          brand: { select: { id: true, name: true, username: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const formatted = await Promise.all(
    conversations.map(async (conv) => {

      const lastMessage = conv.messages[0] || null;

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          isRead: false,
          NOT: {
            OR: [
              userId ? { senderUserId: userId } : undefined,
              brandId ? { senderBrandId: brandId } : undefined,
            ].filter(Boolean) as any,
          },
        },
      });

      const otherParticipant = conv.participants.find(p =>
        userId ? p.userId !== userId : p.brandId !== brandId
      );

      return {
        conversationId: conv.id,
        participant:
          otherParticipant?.user ||
          otherParticipant?.brand,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderUserId: lastMessage.senderUserId,
              senderBrandId: lastMessage.senderBrandId,
            }
          : null,
        unreadCount,
      };
    })
  );

  return formatted;
};
