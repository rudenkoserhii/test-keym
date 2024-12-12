import { Prisma, PrismaClient } from '@prisma/client';
import {
  Inject,
  Injectable,
  OnModuleInit,
  Optional,
  OnApplicationShutdown,
} from '@nestjs/common';

import { PRISMA_SERVICE_OPTIONS } from './prisma.constants';
import { PrismaServiceOptions } from 'prisma/interfaces';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit, OnApplicationShutdown
{

  /**
   * @constructor
   * @param prismaServiceOptions - Optional configuration for the Prisma client.
   * @description Initializes the PrismaService with options such as middlewares and connection configurations.
   */  
  constructor(
    @Optional()
    @Inject(PRISMA_SERVICE_OPTIONS)
    private readonly prismaServiceOptions: PrismaServiceOptions = {},
  ) {
    super(prismaServiceOptions.prismaOptions);

    if (this.prismaServiceOptions.middlewares) {
      this.prismaServiceOptions.middlewares.forEach((middleware) =>
        this.$use(middleware),
      );
    }
  }

  /**
   * @desc Initializes the Prisma client and establishes a connection if `explicitConnect` is set to true in options.
   * @returns {Promise<void>} - A promise that resolves when the Prisma client is successfully connected.
   */  
  async onModuleInit(): Promise<void> {
    if (this.prismaServiceOptions.explicitConnect) {
      await this.$connect();
    }
  }

  /**
   * @desc Cleans up by disconnecting the Prisma client when the application shuts down.
   * @param signal - Optional shutdown signal that may be passed during shutdown (e.g., SIGINT, SIGTERM).
   * @returns {Promise<void>} - A promise that resolves when the Prisma client has disconnected.
   */  
  async onApplicationShutdown(signal?: string): Promise<void> {
    await this.$disconnect();
  }
}
