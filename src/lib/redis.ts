import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

if (!REDIS_URL) throw new Error("Missing Redis URL");

let redis: Redis;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(REDIS_URL);
} else {
  if (!global._redis) {
    global._redis = new Redis(REDIS_URL);
  }
  redis = global._redis;
}

export { redis };
