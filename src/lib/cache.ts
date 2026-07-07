import { redis } from "./redis";

const CACHE_PREFIX = "cache:";

/**
 * Get data from cache, or fetch and store if not present.
 */
export async function getOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 300, // 5 minutes
): Promise<T> {
  const prefixedKey = `${CACHE_PREFIX}${key}`;
  const cached = await redis.get(prefixedKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // If cache is corrupted, fetch fresh
    }
  }

  const fresh = await fetchFn();
  await redis.set(prefixedKey, JSON.stringify(fresh), "EX", ttlSeconds);
  return fresh;
}

/**
 * Invalidate all cache keys matching a pattern.
 * Example: await invalidateCache('dashboard:*');
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const prefixedPattern = `${CACHE_PREFIX}${pattern}`;
  const keys = await redis.keys(prefixedPattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}