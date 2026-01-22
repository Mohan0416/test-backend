import { prisma } from "../config/db";
import { getIO } from "../socket";

export const createNotification = async (
  userId?: string,
  brandId?: string,
  type?: string,
  title?: string,
  body?: string,
  entityId?: string,
  entityType?: string
) => {

if (!userId && !brandId) {
    throw new Error("Notification receiver missing");
  }
  const notif = await prisma.notification.create({
    data: {
      userId,
      brandId,
      type: type!,
      title: title!,
      body: body!,
      entityId,
      entityType,
    },
  });

  const io = getIO();

  try {
    if (userId) io.to(`USER:${userId}`).emit("notification", notif);
    if (brandId) io.to(`BRAND:${brandId}`).emit("notification", notif);
  } catch (err) {
    console.error("Socket emit failed:", err);
  }

  return notif;
};

export const getNotifications = async (
  userId?: string,
  brandId?: string,
  cursor?: string,
  limit = 20
) => {
  if (!userId && !brandId) {
    throw new Error("Identity missing");
  }

  const cursorDate = cursor ? new Date(cursor) : undefined;

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        userId ? { userId } : undefined,
        brandId ? { brandId } : undefined,
      ].filter(Boolean) as any,
      ...(cursorDate && { createdAt: { lt: cursorDate } }),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  });

  let nextCursor = null;

  if (notifications.length > limit) {
    const last = notifications.pop();
    nextCursor = last!.createdAt.toISOString();
  }

  return {
    data: notifications,
    nextCursor,
  };
};


export const markNotificationRead = async (
  notificationId: string,
  userId?: string,
  brandId?: string
) => {
  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notif) throw new Error("Notification not found");

  if (
    (userId && notif.userId !== userId) ||
    (brandId && notif.brandId !== brandId)
  ) {
    throw new Error("Unauthorized");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};


export const getUnreadNotificationCount = async (
  userId?: string,
  brandId?: string
) => {
  if (!userId && !brandId) {
    throw new Error("Identity missing");
  }

  return prisma.notification.count({
    where: {
      isRead: false,
      OR: [
        userId ? { userId } : undefined,
        brandId ? { brandId } : undefined,
      ].filter(Boolean) as any,
    },
  });
};

