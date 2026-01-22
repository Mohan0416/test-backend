import { prisma } from "../config/db";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";

export const fetchNotifications = async (req: AuthRequest, res: Response) => {
  const cursor = req.query.cursor as string | undefined;
  const limit = 20;

  const cursorDate = cursor ? new Date(cursor) : undefined;

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        req.user?.id ? { userId: req.user.id } : undefined,
        req.brand?.id ? { brandId: req.brand.id } : undefined,
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

  res.json({
    data: notifications,
    nextCursor,
  });
};



export const markAllRead = async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: {
      OR: [
        req.user?.id ? { userId: req.user.id } : undefined,
        req.brand?.id ? { brandId: req.brand.id } : undefined,
      ].filter(Boolean) as any,
    },
    data: { isRead: true },
  });

  res.json({ message: "All notifications marked as read" });
};



export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  const { notificationId } = req.params;

  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notif) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (
    (req.user?.id && notif.userId !== req.user.id) ||
    (req.brand?.id && notif.brandId !== req.brand.id)
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  res.json({ message: "Notification marked as read" });
};



export const unreadCount = async (req: AuthRequest, res: Response) => {
  const count = await prisma.notification.count({
    where: {
      isRead: false,
      OR: [
        req.user?.id ? { userId: req.user.id } : undefined,
        req.brand?.id ? { brandId: req.brand.id } : undefined,
      ].filter(Boolean) as any,
    },
  });

  res.json({ count });
};
