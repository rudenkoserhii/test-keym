import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repositoty';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
