// src/cache/memoryCache.js

const cache = new Map();
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

export function getCacheKey(keywords, location) {
  return `${keywords}|${location}`;
}

export function setInCache(key, value, ttl = DEFAULT_TTL) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
}

export function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}
