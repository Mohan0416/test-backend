import { MarketingObjective } from "@prisma/client";

export type MarketingObjectiveRule = {
  allowedCtas: readonly string[];
  requires: readonly string[];
  forbids: readonly string[];
};

export const OBJECTIVE_RULES: Record<
  MarketingObjective,
  MarketingObjectiveRule
> = {
  AWARENESS: {
    allowedCtas: ["Learn More", "Discover", "See More", "View Collection"],
    requires: [],
    forbids: ["destinationUrl", "prefilledMessage", "googleMapsUrl", "appleMapsUrl", "leadForm"],
  },

  TRAFFIC: {
    allowedCtas: ["Visit Website", "Read More", "Shop Now", "Learn More", "View Details"],
    requires: ["destinationUrl"],
    forbids: ["googleMapsUrl", "appleMapsUrl", "leadForm", "prefilledMessage"],
  },

  CONVERSIONS: {
    allowedCtas: ["Buy Now", "Add to Cart", "Book Now", "Download", "Get Started", "Order Now"],
    requires: ["destinationUrl"],
    forbids: ["googleMapsUrl", "appleMapsUrl", "leadForm", "prefilledMessage"],
  },

  GET_DIRECTIONS: {
    allowedCtas: ["Get Directions", "Find Us", "Navigate"],
    requires: ["googleMapsUrl", "appleMapsUrl"],
    forbids: ["destinationUrl", "leadForm", "prefilledMessage"],
  },

  MESSAGING: {
    allowedCtas: ["Send Message", "Chat Now", "Ask a Question", "Contact Us"],
    requires: [],
    forbids: ["destinationUrl", "googleMapsUrl", "appleMapsUrl", "leadForm"],
  },

  LEAD_GENERATION: {
    allowedCtas: ["Sign Up", "Get Quote", "Request Information", "Join Waitlist", "Subscribe"],
    requires: ["leadFormId"],
    forbids: ["destinationUrl", "googleMapsUrl", "appleMapsUrl", "prefilledMessage"],
  },
};
