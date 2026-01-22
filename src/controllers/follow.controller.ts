import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createNotification } from "../services/notification.service";
import {prisma} from '../config/db'

export const followBrand = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id
    const { brandId } = req.params

    const brand = await prisma.brand.findUnique({
    where: { id: brandId }
  })

  if (!brand) {
    return res.status(404).json({ message: "Brand not found" })
  }

  const existing = await prisma.follow.findUnique({
    where: {
      userId_brandId: { userId, brandId }
    }
  })

  if (existing) {
    return res.status(400).json({ message: "You already follow this brand" })
  }

    const follow = await prisma.follow.create({
  data: { userId, brandId }
});

const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { username: true },
});

if (brandId !== req.brand?.id && user) {
  await createNotification(
    undefined,
    brandId,
    "FOLLOW",
    "New Follower",
    `${user.username} started following you`,
    brandId,
    "BRAND"
  );
}

return res.json({
  message: "Brand Followed!",
  follow,
});

}

export const unfollowBrand = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id
    const {brandId} = req.params

    const existing = await prisma.follow.findUnique({
    where: {
      userId_brandId: { userId, brandId }
    }
  })

  if (!existing) {
    return res.status(400).json({ message: "You are not following this brand" })
  }


    await prisma.follow.delete({
        where:{
            userId_brandId: {userId, brandId}
        }
    })

    res.json({message: "Brand unfollowed!"})
}

export const getFollowingBrands = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id

    const brands = await prisma.follow.findMany({
        where: {userId},
        include : {
            brand: {
                select: {id: true, name: true, username: true}
            }
        }
    })

    res.json({count: brands.length,
    dat:brands.map(b=> b.brand)})
}