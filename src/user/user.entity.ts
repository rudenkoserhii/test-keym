import { User, Booking } from '@prisma/client';

export class UserEntity implements User {
  id!: string;
  email!: string;
  password!: string | null;
  name!: string;
  bookings: Booking[];
}
