import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingEntity } from './booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private bookingsService: BookingService) {}

  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, type: [BookingEntity] })
  @Get()
  getAll() {
    return this.bookingsService.getAllBookings();
  }
}
