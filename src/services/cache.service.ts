import { redis } from "../config/index.js";

export async function getCache<T>(
  key: string,
): Promise<T | null> {
  const value = await redis.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number,
) {
  await redis.set(
    key,
    JSON.stringify(value),
    {
      EX: ttlSeconds,
    },
  );
}

export async function deleteCache(
  key: string,
) {
  await redis.del(key);
}