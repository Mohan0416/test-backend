import { prisma } from '../config/db'
import { PublishStatus, MediaType, MarketingObjective} from '@prisma/client'
import { validateMarketingObjective } from '../utils/marketingObjectiveValidator';
import { buildCTA } from '../utils/ctaEngine';

interface MediaInput{
    type: MediaType;
    url: string;
    width?: number;
    height?: number;
    sizeInMB?: number;
    order?: number;
}

interface CreatePostInput {
  brandId: string;

  title?: string;
  description?: string;
  tags?: string[];
  category?: string;

  marketingObjective?: MarketingObjective;
  ctaType?: string;
  ctaText?: string;
  destinationUrl?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;

  prefilledMessage?: string;

  isHighlighted?: boolean;

  publishNow: boolean;
  publishAt?: string;
  timezone?: string;

  media: MediaInput[];

  leadFormId?: string; // if attaching existing form
}


export const createPost = async (data: CreatePostInput) => {

    if(!data.media || data.media.length === 0){
        throw new Error(" Post must contain atleast one media item ")
    }

    const hasVideo = data.media.some((m) => m.type === 'VIDEO')
    if(hasVideo && data.media.length > 1){
        throw new Error('Video posts cannot have multple media items')
    }

    if(!hasVideo && data.media.length > 5){
        throw new Error("Carousel can contain max 5 Images")
    }

    let publishStatus: PublishStatus = PublishStatus.PUBLISHED;
    let publishAt: Date | null = null;


  if (!data.publishNow) {
    if (!data.publishAt || !data.timezone) {
      throw new Error('publishAt and timezone are required for scheduled posts');
    }
    publishStatus = PublishStatus.SCHEDULED;
    publishAt = new Date(data.publishAt);
  }

  validateMarketingObjective(data.marketingObjective, {
  ctaText: data.ctaText,
  destinationUrl: data.destinationUrl,
  googleMapsUrl: data.googleMapsUrl,
  appleMapsUrl: data.appleMapsUrl,
  prefilledMessage: data.prefilledMessage,
  leadForm: data.leadFormId,
});





const post = await prisma.post.create({
  data: {
    brandId: data.brandId,
    title: data.title,
    description: data.description,
    tags: data.tags ?? [],
    category: data.category,

    marketingObjective: data.marketingObjective,
    ctaType: data.ctaType,
    ctaText: data.ctaText,
    destinationUrl: data.destinationUrl,
    googleMapsUrl: data.googleMapsUrl,
    appleMapsUrl: data.appleMapsUrl,
    prefilledMessage: data.prefilledMessage,

    isHighlighted: data.isHighlighted ?? false,

    publishStatus,
    publishAt,
    timezone: data.timezone,

    media: {
      create: data.media.map((m, index) => ({
        type: m.type,
        url: m.url,
        width: m.width,
        height: m.height,
        sizeInMB: m.sizeInMB,
        order: m.order ?? index,
      })),
    },

    ...(data.leadFormId && {
      leadForm: {
        connect: { id: data.leadFormId }
      }
    })
  },
  include: {
    media: true,
    leadForm: true,
  },
});

if (!post) return null;

return {
  ...post,
  cta: buildCTA(post),
};



}

export const attachLeadFormToPost = async (
  postId: string,
  leadFormId: string,
  brandId: string
) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) throw new Error("Post not found");
  if (post.brandId !== brandId) throw new Error("Unauthorized");

  if (post.marketingObjective !== "LEAD_GENERATION") {
    throw new Error("Post is not Lead Generation objective");
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      leadForm: {
        connect: { id: leadFormId },
      },
    },
    include: {
      leadForm: true,
    },
  });
};
