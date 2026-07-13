import Redis from 'ioredis';
import { logger } from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 3) {
      logger.warn('Redis connection failed after 3 retries, running without cache');
      return null;
    }
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redis.on('connect', () => logger.info('✅ Redis connected'));
redis.on('error', (err) => logger.error('❌ Redis error:', err));

// Cache helper functions
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, data: unknown, ttl = 3600): Promise<void> => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {
    // Silently fail - cache is not critical
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch {
    // Silently fail
  }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Silently fail
  }
};
