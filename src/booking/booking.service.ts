import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { BookingEntity } from 'booking/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from 'booking/dto';

const EMPTY_ARRAY = 0;

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /**
   * @desc Retrieves all bookings for a specific user based on userId.
   * @param {string} userId - The ID of the user to fetch bookings for.
   * @returns {Promise<BookingEntity[] | null>} - A list of bookings associated with the user or null if no user ID is provided.
   */
  async getAllBookings(userId: string): Promise<BookingEntity[] | null> {
    return userId ? this.prisma.booking.findMany({ where: { userId }, include: { user: true } }) : null;
  }

  /**
   * @desc Retrieves a specific booking by its ID and ensures it belongs to the authenticated user.
   * @param {string} bookingId - The ID of the booking to fetch.
   * @param {string} userId - The ID of the authenticated user.
   * @returns {Promise<BookingEntity | null>} - The booking entity if it exists and belongs to the user, or null.
   */
  async getBookingById(bookingId: string, userId: string): Promise<BookingEntity | null> {
    const booking = bookingId ? await this.prisma.booking.findUnique({ where: { id: bookingId }, include: { user: true } }) : null;
    return booking?.user?.id === userId ? booking : null;
  }

  /**
   * @desc Creates a new booking after checking for conflicts in the selected hotel and time period.
   * @param {CreateBookingDto} data - The data required to create a new booking, including hotel, start date, and end date.
   * @returns {Promise<BookingEntity | null>} - The created booking entity or null if creation fails.
   * @throws {HttpException} - Throws an exception if the start date is later than the end date, or if the hotel is already booked during the selected period.
   */
  async createBooking(data: CreateBookingDto): Promise<BookingEntity | null> {
    console.log(data);
    
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

  /**
   * @desc Updates an existing booking based on its ID and the provided data, while checking for conflicts.
   * @param {string} bookingId - The ID of the booking to update.
   * @param {UpdateBookingDto} data - The updated data for the booking (e.g., hotel, start date, end date).
   * @returns {Promise<BookingEntity | null>} - The updated booking entity or null if the booking doesn't exist or the update fails.
   * @throws {HttpException} - Throws an exception if the start date is later than the end date, or if the hotel is already booked during the selected period.
   */
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

  /**
   * @desc Deletes a booking based on its ID.
   * @param {string} bookingId - The ID of the booking to delete.
   * @returns {Promise<void>} - A promise that resolves when the booking is deleted.
   */
  async deleteBooking(bookingId: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id: bookingId } });
  }
}
