import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Hotel California', description: 'Name of the hotel', required: true })
  @IsString({ message: 'Hotel name must be a string' })
  readonly hotel: string;

  @ApiProperty({ example: '2025-12-11T12:00:00.000Z', description: 'Booking start date', required: true })
  @IsISO8601({}, { message: 'Start date must be a Date in ISO-8601' })
  readonly startDate: Date;

  @ApiProperty({ example: '2025-12-11T13:00:00.000Z', description: 'Booking end date', required: true })
  @IsISO8601({}, { message: 'End date must be a Date in ISO-8601' })
  readonly endDate: Date;
  
  @ApiProperty({ example: '60d21b3667d0d8992e610c85', description: 'User ID making the booking' })
  @IsOptional()
  readonly userId: string;
}
Object.defineProperty(CreateBookingDto, 'name', {
  value: 'Create Booking',
});
