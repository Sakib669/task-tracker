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
    let rawUrl = process.env.UPSTASH_REDIS_REST_URL;
    if (rawUrl.startsWith('"') && rawUrl.endsWith('"')) {
      rawUrl = rawUrl.slice(1, -1);
    }
    const url = new URL(rawUrl);
    const hostname = url.hostname; // e.g., "abc123.upstash.io"
    // Construct the ioredis-compatible string
    let token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    REDIS_URL = `rediss://default:${token}@${hostname}:6379`;
  } catch (err) {
    console.error("Failed to parse UPSTASH_REDIS_REST_URL:", err);
  }
}

if (!REDIS_URL) {
  console.warn("Missing Redis connection string. Using dummy string for build.");
  REDIS_URL = "redis://dummy:6379";
}

// Singleton pattern for Redis instance
let redis: Redis;
if (REDIS_URL && REDIS_URL.includes('dummy')) {
  // Simple in-memory mock for development/build
  const mockStore: Record<string, string> = {};
  redis = {
    get: async (key: string) => mockStore[key] || null,
    set: async (key: string, value: string, mode?: string, ttl?: number) => {
      mockStore[key] = value;
      return 'OK';
    },
    // @ts-ignore - other methods not needed for current workers
  } as unknown as Redis;
} else {
  if (process.env.NODE_ENV === "production") {
    redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
  } else {
    if (!(global as any)._redis) {
      (global as any)._redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
    }
    redis = (global as any)._redis;
  }
}

export { redis };
