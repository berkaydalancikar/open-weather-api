import type { OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private redisClient: Redis;

  private readonly maxRetries = 5;
  private readonly delayBetweenAttempts = 2000;

  constructor() {
    this.connectWithRetry();
  }

  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      this.redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        lazyConnect: true,
        retryStrategy: () => null,
      });

      this.redisClient.on('error', (err) => {
        console.error(`Redis error: ${err.message}`);
      });

      await this.redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error(`Database connection failed on attempt ${attempt}:`, error);

      if (attempt < this.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.delayBetweenAttempts),
        );
        await this.connectWithRetry(attempt + 1);
      } else {
        console.log(
          `Failed to connect to the database after ${this.maxRetries} attempts.`,
        );
        process.exit(1);
      }
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    return this.redisClient.set(key, JSON.stringify(value));
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
