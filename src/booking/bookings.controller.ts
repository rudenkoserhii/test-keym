import { Controller, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Booking from './bookings.entity';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, type: [Booking] })
  @Get()
  getAll() {
    return this.bookingsService.getAllBookings();
  }
}
