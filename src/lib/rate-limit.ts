import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

export const rateLimiters = {
  strict: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
  }),
  moderate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '60 s'),
  }),
  permissive: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '60 s'),
  }),
};

export type RateLimitKey = keyof typeof rateLimiters;