import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly maxRetries = 5;
  private readonly delayBetweenRetries = 2000;

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      await this.$connect();

      console.log('Database connection successfull.');
    } catch (error) {
      console.error(`Database connection failed on attempt ${attempt}:`, error);

      if (attempt < this.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.delayBetweenRetries),
        );
        await this.connectWithRetry(attempt + 1);
      } else {
        console.error(
          `Failed to connect to the database after ${this.maxRetries} attempts.`,
        );

        process.exit(1);
      }
    }
  }
}
