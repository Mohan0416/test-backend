import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import * as service from "../services/collections.service";

export const createCollectionController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name } = req.body;

  const collection = await service.createCollection(userId, name);
  res.json(collection);
};

export const deleteCollectionController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { collectionId } = req.params;

  await service.deleteCollection(userId, collectionId);
  res.json({ message: "Collection deleted" });
};

export const addPostController = async (req: AuthRequest, res: Response) => {
  const { collectionId, postId } = req.params;

  await service.addPostToCollection(collectionId, postId);
  res.json({ message: "Post added to collection" });
};

export const removePostController = async (req: AuthRequest, res: Response) => {
  const { collectionId, postId } = req.params;

  await service.removePostFromCollection(collectionId, postId);
  res.json({ message: "Post removed from collection" });
};

export const fetchCollectionsController = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const data = await service.getCollections(userId);
  res.json(data);
};

export const fetchCollectionPostsController = async (req: AuthRequest, res: Response) => {
  const { collectionId } = req.params;
  const data = await service.getCollectionPosts(collectionId);

  res.json(data.map(i => i.post));
};
