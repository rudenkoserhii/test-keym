import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBookingDto } from 'booking/dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ example: 'Hotel California', description: 'Name of the hotel', required: false })
  readonly hotel?: string;

  @ApiProperty({ example: '2025-12-11T12:00:00.000Z', description: 'Booking start date', required: false })
  readonly startDate?: Date;

  @ApiProperty({ example: '2025-12-11T13:00:00.000Z', description: 'Booking end date', required: false })
  readonly endDate?: Date;

  @ApiProperty({ example: '60d21b3667d0d8992e610c85', description: 'User ID making the booking', required: false })
  readonly userId?: string;
}

Object.defineProperty(UpdateBookingDto, 'name', {
  value: 'Booking Update',
});
