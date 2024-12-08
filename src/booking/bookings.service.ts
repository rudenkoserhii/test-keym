import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaClient) {}
  async getAllBookings() {
    const bookings = await this.prisma.booking.findMany({ include: { user: true } });
    return bookings;
  }
}
