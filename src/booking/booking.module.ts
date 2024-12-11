import { Module } from '@nestjs/common';

import { BookingController } from 'booking/booking.controller';
import { BookingService } from 'booking/booking.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserModule } from 'user/user.module';

@Module({
  imports: [UserModule],
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
})
export class BookingModule {}
