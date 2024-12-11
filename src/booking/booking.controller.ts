import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BookingEntity } from 'booking/booking.entity';
import { BookingService } from 'booking/booking.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private bookingsService: BookingService) {}

  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, type: [BookingEntity] })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getAll(): Promise<BookingEntity[]> {
    return this.bookingsService.getAllBookings();
  }

  @ApiOperation({ summary: 'Get booking by id' })
  @ApiResponse({ status: 200, type: BookingEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBooking(@Param('id') id: string): Promise<BookingEntity> {
    return this.bookingsService.getBookingById();
  }

  @ApiOperation({ summary: 'Create booking' })
  @ApiResponse({ status: 201, type: BookingEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Body() bookingDto: CreateBookingDto): Promise<BookingEntity> {
    return this.bookingsService.createBooking();
  }
}
