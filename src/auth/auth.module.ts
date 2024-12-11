import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController, AuthService } from 'auth';
import { UserModule } from 'user';
import { PrismaService } from 'prisma/prisma.service';

const TOKEN_LIVE_DURATION = '30d';
const SECRET_DEFAULT = 'SECRET';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || SECRET_DEFAULT,
      signOptions: { expiresIn: TOKEN_LIVE_DURATION },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
