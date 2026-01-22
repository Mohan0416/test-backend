import { MarketingObjective } from "@prisma/client";

export const buildCTA = (post: any) => {
  if (!post.marketingObjective) return null;

  switch (post.marketingObjective) {
    case MarketingObjective.AWARENESS:
    case MarketingObjective.TRAFFIC:
    case MarketingObjective.CONVERSIONS:
      return {
        text: post.ctaText,
        action: "OPEN_URL",
        payload: { url: post.destinationUrl },
      };

    case MarketingObjective.GET_DIRECTIONS:
      return {
        text: post.ctaText,
        action: "OPEN_MAPS",
        payload: {
          googleMapsUrl: post.googleMapsUrl,
          appleMapsUrl: post.appleMapsUrl,
        },
      };

    case MarketingObjective.MESSAGING:
      return {
        text: post.ctaText,
        action: "OPEN_CHAT",
        payload: {
          prefilledMessage: post.prefilledMessage,
        },
      };

    case MarketingObjective.LEAD_GENERATION:
      return {
        text: post.ctaText,
        action: "OPEN_LEAD_FORM",
        payload: {
          leadFormId: post.leadForm?.id,
        },
      };

    default:
      return null;
  }
};
