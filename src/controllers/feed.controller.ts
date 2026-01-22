import { getHomeFeed } from "../services/feed.service";
import {Response} from 'express'
import { getProfileFeed, getExploreFeed } from "../services/feed.service";
import { AuthRequest } from "../middlewares/auth.middleware";


export const getHomeFeedController = async (req:AuthRequest, res:Response) => {

    try{
        const userId = req.user!.id;
        const cursor = req.query.cursor as string | undefined;

        const feed = await getHomeFeed(userId, cursor);

        res.json(feed);
    }
    catch(err){
        res.status(500).json({message: "Failed to load feed"})
    }
 
};

export const getProfileFeedController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { brandId } = req.params;
    const { cursor, limit } = req.query;

    const feed = await getProfileFeed(
      brandId,
      req.user!.id,
      cursor as string | undefined,
      Number(limit) || 10
    );

    res.json(feed);
  } catch {
    res.status(500).json({ message: "Failed to load profile feed" });
  }
};

export const getExploreFeedController = async (req: AuthRequest, res: Response) => {
  try {
    const { cursor, limit } = req.query;

    const feed = await getExploreFeed(
      req.user!.id,
      cursor as string | undefined,
      Number(limit) || 10
    );

    res.json(feed);
  } catch {
    res.status(500).json({ message: "Failed to load explore feed" });
  }
};
