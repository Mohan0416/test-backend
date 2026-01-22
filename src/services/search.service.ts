import { prisma } from "../config/db";

export type SearchResultType = "EXACT" | "PARTIAL" | "FALLBACK" | "TRENDING";

export interface SearchResult {
  type: SearchResultType;
  data: any[];
}


const CATEGORY_MAP: Record<string, string[]> = {
  sneakers: ["shoes", "footwear"],
  iphone: ["phones", "electronics"],
  laptop: ["computers", "electronics"],
  sofa: ["furniture"],
  chair: ["furniture"],
  watch: ["accessories", "electronics"],
};

export const searchPosts = async (
  query: string,
  userId: string | null
): Promise<SearchResult> => {
  const q = query.toLowerCase().trim();

  // 1️⃣ Exact match
  const exact = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
      OR: [
        { title: { equals: q, mode: "insensitive" } },
        { category: { equals: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
    },
    include: { media: true, brand: true },
    take: 20,
  });

  if (exact.length > 0) {
    return { type: "EXACT", data: exact };
  }

  // 2️⃣ Partial match
  const partial = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q] } },
      ],
    },
    include: { media: true, brand: true },
    take: 20,
  });

  if (partial.length > 0) {
    return { type: "PARTIAL", data: partial };
  }

  // 3️⃣ Category fallback
  const fallbackCategories = CATEGORY_MAP[q] || [];

  if (fallbackCategories.length > 0) {
    const fallback = await prisma.post.findMany({
      where: {
        publishStatus: "PUBLISHED",
        category: { in: fallbackCategories },
      },
      include: { media: true, brand: true },
      take: 20,
    });

    if (fallback.length > 0) {
      return { type: "FALLBACK", data: fallback };
    }
  }

  // 4️⃣ Trending fallback
  const trending = await prisma.post.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: { trendingScore: "desc" },
    include: { media: true, brand: true },
    take: 20,
  });

  return { type: "TRENDING", data: trending };
};
