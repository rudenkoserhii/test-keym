import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BookingEntity } from 'booking/booking.entity';
import { BookingService } from 'booking/booking.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { CreateBookingDto, UpdateBookingDto } from 'booking/dto';
import { Request, Response } from 'express';
import { ROUTES } from 'constants/routes.enum';
import { SWAGGER } from 'constants/swagger.enum';
import { MESSAGES } from 'constants/messages.enum';
import { DESCRIPTIONS } from 'constants/descriptions.enum';

@ApiTags(SWAGGER.BOOKINGS.CONTROLLER.TAGS)
@Controller(ROUTES.BOOKINGS)
@ApiBearerAuth()
export class BookingController {
  constructor(private bookingsService: BookingService) { }

  /**
   * @desc Retrieves all bookings for the authenticated user.
   * @param {Request} req - The request object containing the user's ID.
   * @returns {Promise<BookingEntity[] | null>} - A list of bookings associated with the authenticated user, or null if no bookings are found.
   * @throws {HttpException} - Throws a 404 if no bookings are found for the user.
   */
  @Get(ROUTES.ROOT)
  @ApiOperation({ summary: SWAGGER.BOOKINGS.CONTROLLER.GET_ALL })
  @ApiResponse({ status: HttpStatus.OK, type: [BookingEntity] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: Request): Promise<BookingEntity[] | null> {
    const { user: { id: userId } = {} } = req || {};
    const bookings = await this.bookingsService.getAllBookings(userId);
    if (!bookings) {
      throw new HttpException(MESSAGES.BOOKINGS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return bookings;
  }

  /**
   * @desc Retrieves a specific booking by its ID for the authenticated user.
   * @param {string} bookingId - The ID of the booking to retrieve.
   * @param {Request} req - The request object containing the user's ID.
   * @returns {Promise<BookingEntity | null>} - The booking entity if found and belongs to the authenticated user, or null if not found.
   * @throws {HttpException} - Throws a 404 if the booking is not found or doesn't belong to the user.
   */
  @Get(ROUTES.BOOKING_WITH_ID)
  @ApiOperation({ summary: SWAGGER.BOOKINGS.CONTROLLER.GET_ALONE })
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  // getAlone(@Param('id') bookingId: string, @Req() req: Request): Promise<BookingEntity | null> {
  //   const { user: { id: userId } = {} } = req || {};
  //   return this.bookingsService.getBookingById(bookingId, userId);
  // }
  async getAlone(@Param('id') bookingId: string, @Req() req: Request): Promise<BookingEntity | null> {
    const { user: { id: userId } = {} } = req || {};
    const booking = await this.bookingsService.getBookingById(bookingId, userId);
    if (!booking) {
      throw new HttpException(MESSAGES.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return booking;
  }

  /**
   * @desc Creates a new booking for the authenticated user.
   * @param {Request} req - The request object containing the user's ID.
   * @param {CreateBookingDto} bookingDto - The data to create a new booking (hotel, start date, end date).
   * @param {Response} res - The response object used to send a response.
   * @returns {Promise<BookingEntity>} - The created booking entity.
   * @throws {HttpException} - Throws a 400 error if the start date is later than the end date, or if the hotel is already booked during the selected time.
   */
  @Post(ROUTES.ROOT)
  @ApiOperation({ summary: SWAGGER.BOOKINGS.CONTROLLER.CREATE })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookingEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  create(@Req() req: Request, @Body() bookingDto: CreateBookingDto, @Res() res: Response): Promise<BookingEntity | null> {
    try {
      const { user: { id: userId } = {} } = req || {};
      return this.bookingsService.createBooking({ userId, ...bookingDto });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(MESSAGES.UNEXPECTED_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @desc Updates a booking by its ID with the provided data.
   * @param {string} bookingId - The ID of the booking to update.
   * @param {UpdateBookingDto} bookingDto - The updated data for the booking (e.g., hotel, start date, end date).
   * @returns {Promise<BookingEntity>} - The updated booking entity.
   * @throws {HttpException} - Throws a 404 error if the booking is not found, or if the hotel is already booked during the updated period.
   */
  @Patch(ROUTES.BOOKING_WITH_ID)
  @ApiOperation({ summary: SWAGGER.BOOKINGS.CONTROLLER.UPDATE })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookingEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') bookingId: string, @Body() bookingDto: UpdateBookingDto): Promise<BookingEntity> {
    return this.bookingsService.updateBookingById(bookingId, bookingDto);
  }

  /**
   * @desc Deletes a booking by its ID.
   * @param {string} bookingId - The ID of the booking to delete.
   * @returns {Promise<void>} - A promise that resolves once the booking is deleted.
   * @throws {HttpException} - Throws a 404 error if the booking is not found.
   */
  @Delete(ROUTES.BOOKING_WITH_ID)
  @ApiOperation({ summary: SWAGGER.BOOKINGS.CONTROLLER.DELETE })
  @ApiResponse({ status: HttpStatus.OK, description: DESCRIPTIONS.BOOKING_DELETED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') bookingId: string): Promise<void> {
    return this.bookingsService.deleteBooking(bookingId);
  }
}
