import { redis } from './redis';

export async function getOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // If cache corrupted, ignore and fetch fresh
    }
  }

  const fresh = await fetchFn();
  await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
  return fresh;
}

export async function invalidateCache(keyPattern: string) {
  const keys = await redis.keys(keyPattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}