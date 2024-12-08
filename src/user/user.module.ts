import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repositoty';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
