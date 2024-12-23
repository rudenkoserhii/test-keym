import { Module } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { UserController } from 'user/user.controller';
import { UserRepository } from 'user/user.repository';
import { UserService } from 'user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
