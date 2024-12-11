import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { UserModule } from 'user/user.module';
import { AuthModule } from 'auth/auth.module';
import { BookingModule } from 'booking/booking.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AppService } from 'app/app.service';
import { AppController } from 'app/app.controller';

const TTL = 60000;
const LIMIT = 14;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    BookingModule,
    ThrottlerModule.forRoot([
      {
        ttl: TTL,
        limit: LIMIT,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
