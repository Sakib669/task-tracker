import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const rateLimiters = {
  strict: new Ratelimit({
    redis: redis as any, // type assertion to avoid version mismatch
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
  }),
  moderate: new Ratelimit({
    redis: redis as any,
    limiter: Ratelimit.slidingWindow(20, "60 s"),
  }),
  permissive: new Ratelimit({
    redis: redis as any,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
  }),
};

export type RateLimitKey = keyof typeof rateLimiters;
