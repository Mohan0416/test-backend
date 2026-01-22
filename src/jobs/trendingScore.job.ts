import { prisma } from "../config/db";

export const updateTrendingScores = async () => {
  const posts = await prisma.post.findMany({
    where: { publishStatus: "PUBLISHED" },
    include: {
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  const now = new Date();

  for (const post of posts) {
    const hours = Math.max(1, (now.getTime() - post.createdAt.getTime()) / 3600000);
    
    // Engagement points
    const engagementScore = post._count.likes * 2 + post._count.comments * 3;
    
    // Use logarithmic time decay instead of linear
    // This way older posts aren't penalized as heavily
    // Formula inspired by Hacker News/Reddit ranking
    const gravity = 1.5; // How fast posts decay
    const timeDecay = Math.pow(hours + 2, gravity);
    
    // Score = engagement / time decay
    // Adding base score ensures posts with engagement always rank higher than posts without
    const baseScore = engagementScore > 0 ? 1000 : 0;
    const score = baseScore + (engagementScore * 1000) / timeDecay;

    await prisma.post.update({
      where: { id: post.id },
      data: { trendingScore: score },
    });
  }
};
