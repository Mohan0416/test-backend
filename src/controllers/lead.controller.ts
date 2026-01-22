import { submitLeadForm, getLeadsForPost } from "../services/lead.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import {prisma} from '../config/db'

export const submitLead = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, formId } = req.params;
    const { answers } = req.body;

    const lead = await submitLeadForm(
      postId,
      formId,
      req.user!.id,
      answers
    );

    res.json(lead);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const fetchLeadsForPost = async (req: AuthRequest, res: Response) => {
  if (!req.brand) {
    return res.status(403).json({ message: "Brand only" });
  }

  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { brandId: true }
  });

  if (!post || post.brandId !== req.brand.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const leads = await getLeadsForPost(postId);

  res.json(leads);
};
