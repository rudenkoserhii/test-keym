import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { BookingEntity } from 'booking/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from 'booking/dto';

const EMPTY_ARRAY = 0;

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}
  async getAllBookings(userId: string): Promise<BookingEntity[] | null> {
    return userId ? this.prisma.booking.findMany({ where: { userId }, include: { user: true } }) : null;
  }

  async getBookingById(bookingId: string, userId: string): Promise<BookingEntity | null> {
    const booking = bookingId ? await this.prisma.booking.findUnique({ where: { id: bookingId }, include: { user: true } }) : null;
    console.log('booking', booking);
    
    return booking?.user?.id === userId ? booking : null;
  }

  async createBooking(data: CreateBookingDto): Promise<BookingEntity | null> {
    const { hotel, startDate, endDate } = data || {};
    if (startDate > endDate) {
      throw new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST);
    }
    const busySlots = await this.prisma.booking.findMany({
      where: {
        hotel,
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });

    if (busySlots.length > EMPTY_ARRAY) {
      throw new HttpException('This hotel is already booked during the selected time period', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.booking.create({ data, include: { user: true } }) || null;
  }

  async updateBookingById(bookingId: string, data: UpdateBookingDto): Promise<BookingEntity | null> {
    const { hotel: hotelOld, startDate: startDateOld, endDate: endDateOld } = await this.prisma.booking.findUnique({ where: { id: bookingId } }) || {};
    const { hotel, startDate, endDate } = data || {};
    let busySlots: BookingEntity[];

    switch (true) {
      case Boolean(hotel && startDate && endDate): 
        if (startDate > endDate) {
          throw new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST);
        }
        busySlots = await this.prisma.booking.findMany({
          where: {
            hotel,
            AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
          },
          include: { user: true }
        });

        if (busySlots.length > EMPTY_ARRAY) {
          throw new HttpException('This hotel is already booked during the selected time period', HttpStatus.BAD_REQUEST);
        };
        break;
      case Boolean(!hotel && startDate && endDate): 
      if (startDate > endDate) {
        throw new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST);
      }
      busySlots = await this.prisma.booking.findMany({
        where: {
          hotel: hotelOld,
          AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
        },
        include: { user: true }
      });

      if (busySlots.length > EMPTY_ARRAY) {
        throw new HttpException('This hotel is already booked during the selected time period', HttpStatus.BAD_REQUEST);
      };
      break;
      case Boolean(!hotel && !startDate && endDate): 
      if (startDateOld > endDate) {
        throw new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST);
      }
      busySlots = await this.prisma.booking.findMany({
        where: {
          hotel: hotelOld,
          AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDateOld } }],
        },
        include: { user: true }
      });

      if (busySlots.length > EMPTY_ARRAY) {
        throw new HttpException('This hotel is already booked during the selected time period', HttpStatus.BAD_REQUEST);
      };
      break;
      case Boolean(!hotel && startDate && !endDate): 
      if (startDate > endDateOld) {
        throw new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST);
      }
      busySlots = await this.prisma.booking.findMany({
        where: {
          hotel: hotelOld,
          AND: [{ startDate: { lt: endDateOld } }, { endDate: { gt: startDate } }],
        },
        include: { user: true }
      });

      if (busySlots.length > EMPTY_ARRAY) {
        throw new HttpException('This hotel is already booked during the selected time period', HttpStatus.BAD_REQUEST);
      };
      break;
      case Boolean(hotel && !startDate && !endDate): 
      busySlots = await this.prisma.booking.findMany({
        where: {
          hotel,
          AND: [{ startDate: { lt: endDateOld } }, { endDate: { gt: startDateOld } }],
        },
        include: { user: true }
      });

      if (busySlots.length > EMPTY_ARRAY) {
        throw new HttpException('This hotel is already booked during the selected time period', HttpStatus.BAD_REQUEST);
      };
      break;
      default: return;
    };

    return bookingId && data ? this.prisma.booking.update({ where: { id: bookingId }, data, include: { user: true } }) : null;
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id: bookingId } });
  }
}
