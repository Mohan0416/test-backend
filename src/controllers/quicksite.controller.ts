import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import { upsertQuicksite, getQuicksite } from "../services/quicksite.service";

export const saveQuicksite = async (req: AuthRequest, res: Response) => {
  const brandId = req.brand!.id;

  const site = await upsertQuicksite(brandId, req.body);

  res.json(site);
};

export const fetchQuicksite = async (req: AuthRequest, res: Response) => {
  const { brandId } = req.params;

  const site = await getQuicksite(brandId);

  res.json(site);
};
