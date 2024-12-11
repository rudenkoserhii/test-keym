import { Prisma, PrismaClient } from '@prisma/client';
import {
  Inject,
  Injectable,
  OnModuleInit,
  Optional,
  OnApplicationShutdown,
} from '@nestjs/common';

import { PRISMA_SERVICE_OPTIONS } from 'prisma/prisma.constants';
import { PrismaServiceOptions } from 'prisma/interfaces';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit, OnApplicationShutdown
{
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

  async onModuleInit() {
    if (this.prismaServiceOptions.explicitConnect) {
      await this.$connect();
    }
  }

  async onApplicationShutdown(signal?: string) {
    await this.$disconnect();
  }
}
