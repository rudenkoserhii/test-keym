import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BookingEntity } from 'booking/booking.entity';
import { BookingService } from 'booking/booking.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { CreateBookingDto, UpdateBookingDto } from 'booking/dto';
import { Request, Response } from 'express';

@ApiTags('Bookings')
@Controller('bookings')
@ApiBearerAuth()
export class BookingController {
  constructor(private bookingsService: BookingService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: HttpStatus.OK, type: [BookingEntity] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  getAll(@Req() req: Request): Promise<BookingEntity[] | null> {
    const { user: { id: userId } = {} } = req || {};
    return this.bookingsService.getAllBookings(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  getAlone(@Param('id') bookingId: string, @Req() req: Request): Promise<BookingEntity | null> {
    console.log('bookingId', bookingId);
    const { user: { id: userId } = {} } = req || {};
    return this.bookingsService.getBookingById(bookingId, userId);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create booking' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookingEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  create(@Req() req: Request, @Body() bookingDto: CreateBookingDto, @Res() res: Response) {
    console.log('bookingDto', bookingDto);
    try {
      

    const { user: { id: userId } = {} } = req || {};
    console.log('userId', userId);
    return this.bookingsService.createBooking({ userId, ...bookingDto});
  } catch (error) {
    console.log('Error:', error.message);
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({ message: error.getResponse() });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'An unexpected error occurred',
    });
  }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookingEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') bookingId: string, @Body() bookingDto: UpdateBookingDto): Promise<BookingEntity> {
    return this.bookingsService.updateBookingById(bookingId, bookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') bookingId: string): Promise<void> {
    return this.bookingsService.deleteBooking(bookingId);
  }
}
