import { MarketingObjective } from "@prisma/client";

export const validateMarketingObjective = (
  objective?: MarketingObjective,
  data?: {
    ctaText?: string;
    destinationUrl?: string;
    googleMapsUrl?: string;
    appleMapsUrl?: string;
    prefilledMessage?: string;
    leadForm?: string;
  }
) => {
  if (!objective) return;

  switch (objective) {
    case MarketingObjective.TRAFFIC:
    case MarketingObjective.CONVERSIONS:
      if (!data?.destinationUrl) {
        throw new Error("Destination URL is required for this objective");
      }
      break;

    case MarketingObjective.GET_DIRECTIONS:
      if (!data?.googleMapsUrl || !data?.appleMapsUrl) {
        throw new Error("Google Maps and Apple Maps URLs are required");
      }
      break;

    case MarketingObjective.LEAD_GENERATION:
      // ❗ DO NOT validate leadForm here
      break;

    case MarketingObjective.MESSAGING:
    case MarketingObjective.AWARENESS:
      break;

    default:
      throw new Error("Invalid marketing objective");
  }
};
