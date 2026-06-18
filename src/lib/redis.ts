import Redis from "ioredis";

let REDIS_URL: string | undefined;

// 1. Check for a full REDIS_URL first (Render, self-hosted, or Upstash ioredis string)
if (process.env.REDIS_URL) {
  REDIS_URL = process.env.REDIS_URL;
}
// 2. Fallback: construct from Upstash REST URL + Token
else if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    const url = new URL(process.env.UPSTASH_REDIS_REST_URL);
    const hostname = url.hostname; // e.g., "abc123.upstash.io"
    // Construct the ioredis-compatible string
    REDIS_URL = `rediss://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${hostname}:6379`;
  } catch (err) {
    console.error("Failed to parse UPSTASH_REDIS_REST_URL:", err);
  }
}

if (!REDIS_URL) {
  throw new Error(
    "Missing Redis connection string. Set either:\n" +
      "  - REDIS_URL (full connection string)\n" +
      "  - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (for Upstash)",
  );
}

// Singleton pattern for Redis instance
let redis: Redis;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(REDIS_URL);
} else {
  if (!(global as any)._redis) {
    (global as any)._redis = new Redis(REDIS_URL);
  }
  redis = (global as any)._redis;
}

export { redis };
