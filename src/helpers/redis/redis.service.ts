import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async getCache(key: string): Promise<Record<string, any>> {
    const client = this.getClient();
    const data = await client.get(key);

    return data ? JSON.parse(data) : null;
  }

  async setCache(key: string, value: string): Promise<void> {
    const client = this.getClient();
    await client.set(key, value);
  }
}
