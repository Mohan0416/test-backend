import { prisma } from "../config/db";
import { getIO } from "../socket";
import { createNotification } from "./notification.service";


const verifyParticipant = async (
  conversationId: string,
  userId?: string,
  brandId?: string
) => {
  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      OR: [
        userId ? { userId } : undefined,
        brandId ? { brandId } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (!participant) {
    throw new Error("Access denied to this conversation");
  }
};


export const sendMessage = async (
  conversationId: string,
  senderUserId?: string,
  senderBrandId?: string,
  content?: string
) => {
  if (!content || content.trim().length === 0) {
    throw new Error("Message content is required");
  }

  if (!senderUserId && !senderBrandId) {
    throw new Error("Sender identity missing");
  }

  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      OR: [
        senderUserId ? { userId: senderUserId } : undefined,
        senderBrandId ? { brandId: senderBrandId } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (!participant) {
    throw new Error("You are not allowed to send messages in this conversation");
  }

  // Fetch sender name
  const senderUser = senderUserId
    ? await prisma.user.findUnique({
        where: { id: senderUserId },
        select: { username: true },
      })
    : null;

  const senderBrand = senderBrandId
    ? await prisma.brand.findUnique({
        where: { id: senderBrandId },
        select: { name: true },
      })
    : null;

  const senderName =
    senderUser?.username || senderBrand?.name || "Someone";

  // 1️⃣ Save message
  const msg = await prisma.message.create({
    data: {
      conversationId,
      senderUserId: senderUserId || null,
      senderBrandId: senderBrandId || null,
      content: content.trim(),
    },
  });

  // 2️⃣ Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // 3️⃣ Emit realtime events
  const io = getIO();

  const participants = await prisma.conversationParticipant.findMany({
    where: { conversationId },
  });

  for (const p of participants) {
    // USER receiver
    if (p.userId && p.userId !== senderUserId) {
      io.to(`USER:${p.userId}`).emit("new_message", msg);
      io.to(`USER:${p.userId}`).emit("conversation_updated", {
        conversationId,
      });

      await createNotification(
        p.userId,
        undefined,
        "MESSAGE",
        "New Message",
        `${senderName} sent you a message`,
        conversationId,
        "CONVERSATION"
      );
    }

    // BRAND receiver
    if (p.brandId && p.brandId !== senderBrandId) {
      io.to(`BRAND:${p.brandId}`).emit("new_message", msg);
      io.to(`BRAND:${p.brandId}`).emit("conversation_updated", {
        conversationId,
      });

      await createNotification(
        undefined,
        p.brandId,
        "MESSAGE",
        "New Message",
        `${senderName} sent you a message`,
        conversationId,
        "CONVERSATION"
      );
    }
  }

  return msg;
};






export const getMessages = async (
  conversationId: string,
  cursor?: string,
  limit = 20,
  userId?: string,
  brandId?: string
) => {

  await verifyParticipant(conversationId, userId, brandId);

  const cursorDate = cursor ? new Date(cursor) : undefined;

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      ...(cursorDate && { createdAt: { lt: cursorDate } }),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  });

  let nextCursor = null;

  if (messages.length > limit) {
    const last = messages.pop();
    nextCursor = last!.createdAt.toISOString();
  }

  return {
    data: messages.reverse(),
    nextCursor,
  };
};


export const markMessagesAsRead = async (
  conversationId: string,
  userId?: string,
  brandId?: string
) => {

  if (!userId && !brandId) {
    throw new Error("Reader identity missing");
  }

  await verifyParticipant(conversationId, userId, brandId);

  await prisma.message.updateMany({
    where: {
      conversationId,
      isRead: false,
      NOT: {
        OR: [
          userId ? { senderUserId: userId } : undefined,
          brandId ? { senderBrandId: brandId } : undefined,
        ].filter(Boolean) as any,
      },
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  const unread = await prisma.message.count({
    where: {
      conversationId,
      isRead: false,
      NOT: {
        OR: [
          userId ? { senderUserId: userId } : undefined,
          brandId ? { senderBrandId: brandId } : undefined,
        ].filter(Boolean) as any,
      },
    },
  });

  const io = getIO();

  const participants = await prisma.conversationParticipant.findMany({
    where: { conversationId },
  });

  participants.forEach(p => {
    if (p.userId && p.userId !== userId) {
      io.to(`USER:${p.userId}`).emit("messages_read", {
        conversationId,
        readerUserId: userId,
      });

      io.to(`USER:${p.userId}`).emit("unread_update", {
        conversationId,
        unreadCount: unread,
      });
    }

    if (p.brandId && p.brandId !== brandId) {
      io.to(`BRAND:${p.brandId}`).emit("messages_read", {
        conversationId,
        readerBrandId: brandId,
      });

      io.to(`BRAND:${p.brandId}`).emit("unread_update", {
        conversationId,
        unreadCount: unread,
      });
    }
  });
};



export const getUnreadCount = async (
  conversationId: string,
  userId?: string,
  brandId?: string
) => {

  if (!userId && !brandId) {
    throw new Error("Identity missing");
  }

  await verifyParticipant(conversationId, userId, brandId);

  return prisma.message.count({
    where: {
      conversationId,
      isRead: false,
      NOT: {
        OR: [
          userId ? { senderUserId: userId } : undefined,
          brandId ? { senderBrandId: brandId } : undefined,
        ].filter(Boolean) as any,
      },
    },
  });
};

