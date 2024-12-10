import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}
  async getAllBookings() {
    // return true;
    return this.prisma.booking.findMany({ include: { user: true } });
  }
}
