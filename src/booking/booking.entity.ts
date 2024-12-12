import { ApiProperty } from '@nestjs/swagger';
import { User, Booking } from '@prisma/client';

import { UserEntity } from 'user';

export class BookingEntity implements Booking {
  @ApiProperty({ example: '60d21b3667d0d8992e610c85', description: 'The unique identifier for a booking' })
  id!: string;
  @ApiProperty({ example: 'Hotel California', description: 'Name of the hotel', required: false })
  hotel!: string;
  @ApiProperty({ example: '2025-12-11T12:00:00.000Z', description: 'Booking start date', required: false })
  startDate!: Date;
  @ApiProperty({ example: '2025-12-11T13:00:00.000Z', description: 'Booking end date', required: false })
  endDate!: Date;
  @ApiProperty({ description: 'Related user Entity', type: [UserEntity], required: false })
  user!: User;
  @ApiProperty({ example: '60d21b3667d0d8992e610c85', description: 'User ID making the booking', required: false })
  userId!: string;
}
export { Booking };