import { prisma } from "../config/db";
import { buildCTA } from "../utils/ctaEngine";

const LIMIT = 13;

const postInclude = (userId: string) => ({
  media: true,
  brand: {
    select: { id: true, name: true, username: true },
  },
  likes: {
    where: { userId },
    select: { id: true },
  },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
});

const formatPost = (p: any) => ({
  ...p,
  cta: buildCTA(p),

  isLiked: p.likes.length > 0,
  likeCount: p._count.likes,
  commentCount: p._count.comments,

  likes: undefined,
  _count: undefined,
});

export const getHomeFeed = async (
  userId: string,
  cursor?: string
) => {
  const cursorData = cursor ? JSON.parse(cursor) : undefined;

  const follows = await prisma.follow.findMany({
    where: { userId },
    select: { brandId: true },
  });

  const followedBrandIds = follows.map(f => f.brandId);

  if (followedBrandIds.length > 0) {
    return getFollowedFeed(userId, followedBrandIds, cursorData);
  }

  return getDiscoveryFeed(userId, cursorData);
};

const getFollowedFeed = async (
  userId: string,
  followedBrandIds: string[],
  cursorData?: { date: string; type: string }
) => {
  const cursorDate = cursorData?.date ? new Date(cursorData.date) : undefined;

  const followedPosts = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
      brandId: { in: followedBrandIds },
      ...(cursorDate && { createdAt: { lt: cursorDate } }),
    },
    include: postInclude(userId),
    orderBy: { createdAt: "desc" },
    take: Math.ceil(LIMIT * 0.8) + 1,
  });

  // Suggested: prioritize trending posts from non-followed brands
  const suggestedPosts = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
      brandId: { notIn: followedBrandIds },
      // Weak time filter for suggested to keep them somewhat fresh, or remove if "trending" is all time
    },
    include: postInclude(userId),
    orderBy: [
      { trendingScore: "desc" },
      { createdAt: "desc" }
    ],
    take: Math.ceil(LIMIT * 0.2) + 1,
  });

  const allPosts = [...followedPosts, ...suggestedPosts]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Keep chronological for the mixed feed? Or mixed?
    // User wants trending. But followed feed usually implies chronological. 
    // I'll keep the final sort chronological (Twitter style) but the selection of suggested is trending.
    .slice(0, LIMIT + 1);

  return formatFeed(allPosts);
};

const getDiscoveryFeed = async (
  userId: string,
  cursorData?: { id: string }
) => {
  // Pure Trending Feed Algorithm
  // Sorts by Trending Score Descending, then ID Descending (for stability)
  const posts = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
    },
    include: postInclude(userId),
    orderBy: [
      { trendingScore: "desc" },
      { id: "desc" }
    ],
    take: LIMIT + 1,
    skip: cursorData?.id ? 1 : 0,
    cursor: cursorData?.id ? { id: cursorData.id } : undefined,
  });

  return {
    data: posts.slice(0, LIMIT).map(formatPost),
    nextCursor: posts.length > LIMIT
      ? JSON.stringify({ id: posts[LIMIT - 1].id })
      : null
  };
};

const formatFeed = (posts: any[]) => {
  let nextCursor = null;

  if (posts.length > LIMIT) {
    const lastPost = posts.pop();
    // For date-based feeds (like followed), we stick to date cursor
    nextCursor = JSON.stringify({
      date: lastPost.createdAt.toISOString(),
    });
  }

  return {
    data: posts.map(formatPost),
    nextCursor,
  };
};

export const getProfileFeed = async (
  brandId: string,
  userId: string,
  cursor?: string,
  limit: number = LIMIT
) => {
  const cursorData = cursor ? JSON.parse(cursor) : undefined;
  const cursorDate = cursorData?.date
    ? new Date(cursorData.date)
    : undefined;

  const posts = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
      brandId,
      ...(cursorDate && { createdAt: { lt: cursorDate } }),
    },
    include: postInclude(userId),
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  });

  return formatFeed(posts);
};

export const getExploreFeed = async (
  userId: string,
  cursor?: string,
  limit: number = LIMIT
) => {
  // Explore also uses the global trending logic but explicitly mixes styles
  // We can reuse the Discovery logic for consistency, or keep the specific mix
  // keeping simpler logic for now:

  const cursorData = cursor ? JSON.parse(cursor) : undefined;

  // Just use the robust trending query
  const posts = await prisma.post.findMany({
    where: {
      publishStatus: "PUBLISHED",
    },
    include: postInclude(userId),
    orderBy: [
      { trendingScore: "desc" },
      { id: "desc" }
    ],
    take: limit + 1,
    skip: cursorData?.id ? 1 : 0,
    cursor: cursorData?.id ? { id: cursorData.id } : undefined,
  });

  return {
    data: posts.slice(0, limit).map(formatPost),
    nextCursor: posts.length > limit
      ? JSON.stringify({ id: posts[limit - 1].id })
      : null
  };
};
