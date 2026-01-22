import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as service from "../services/leadForm.service";
import { LeadFieldType } from "@prisma/client";

export const createForm = async (req: AuthRequest, res: Response) => {
  if (!req.brand) return res.status(403).json({ message: "Brand only" });

  const { postId, title, intro } = req.body;

  if (!postId) return res.status(400).json({ message: "postId required" });

  const form = await service.createLeadForm(postId, title, intro);
  res.json(form);
};

export const addField = async (req: AuthRequest, res: Response) => {
  if (!req.brand) return res.status(403).json({ message: "Brand only" });

  const { formId, label, type, isRequired, options, order } = req.body;

  if (!formId || !label || !type)
    return res.status(400).json({ message: "Missing fields" });

  const field = await service.addLeadFormField(
    formId,
    label,
    type as LeadFieldType,
    isRequired ?? false,
    options || [],
    order ?? 0
  );

  res.json(field);
};

export const deleteField = async (req: AuthRequest, res: Response) => {
  if (!req.brand) return res.status(403).json({ message: "Brand only" });

  const { fieldId } = req.params;
  await service.deleteLeadFormField(fieldId);
  res.json({ message: "Field deleted" });
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
  if (!req.brand) return res.status(403).json({ message: "Brand only" });

  const { fieldId } = req.params;
  const { order } = req.body;

  const field = await service.updateFieldOrder(fieldId, order);
  res.json(field);
};

export const fetchForm = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const form = await service.getFormByPost(postId);
  res.json(form);
};
