import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware' 
import { createPost } from '../services/post.service'
import { attachLeadFormToPost } from '../services/post.service'

export const createPostController = async(req: AuthRequest, res: Response) => { 
  try {
    const brandId = req.brand?.id;  

    if (!brandId) {
      return res.status(403).json({ message: "Brand authentication required" });
    }

    const post = await createPost({
      brandId,
      ...req.body
    })

    return res.status(201).json(post)

  } catch(error: any){
    return res.status(400).json({ message: error.message || 'Post creation failed'})
  }
}

export const attachLeadFormController = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const { leadFormId } = req.body;

  const post = await attachLeadFormToPost(postId, leadFormId, req.brand!.id);

  res.json(post);
};
