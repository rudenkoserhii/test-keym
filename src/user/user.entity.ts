import { ApiProperty } from '@nestjs/swagger';
import { User, Booking } from '@prisma/client';

import { BookingEntity } from 'booking/booking.entity';

export class UserEntity implements User {
  @ApiProperty({
    example: '60d21b3667d0d8992e610c85',
    description: 'The unique identifier for the user',
  })
  id!: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'The email of the user',
  })
  email!: string;

  @ApiProperty({
    example: '12345',
    description: 'The password of the user',
    required: false,
  })
  password!: string | null;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  name!: string;

  @ApiProperty({
    description: 'List of bookings associated with the user',
    type: [BookingEntity],
    required: false,
  })
  bookings?: Booking[];
}
