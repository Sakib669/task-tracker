import Redis from "ioredis";

// Use Render's REDIS_URL, or Upstash's URL if provided
const REDIS_URL = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

if (!REDIS_URL) {
  throw new Error(
    "Missing Redis URL. Set REDIS_URL or UPSTASH_REDIS_REST_URL.",
  );
}

let redis: Redis;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(REDIS_URL);
} else {
  // In development, reuse the same connection across hot reloads
  if (!(global as any)._redis) {
    (global as any)._redis = new Redis(REDIS_URL);
  }
  redis = (global as any)._redis;
}

export { redis };
