import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { searchPosts } from "../services/search.service";

export type SearchResultType = "EXACT" | "PARTIAL" | "FALLBACK" | "TRENDING";


export const searchController = async (req: AuthRequest, res: Response) => {
  const q = req.query.q as string;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ message: "Search query too short" });
  }

  const userId = req.user?.id ?? null;

  const result = await searchPosts(q, userId);

  const messages: Record<SearchResultType, string | null> = {
    EXACT: null,
    PARTIAL: `Showing results related to "${q}"`,
    FALLBACK: `No exact results for "${q}". Showing related products.`,
    TRENDING: `No results found for "${q}". Showing popular products.`,
  };

  res.json({
    query: q,
    type: result.type,
    message: messages[result.type],
    data: result.data,
  });
};
