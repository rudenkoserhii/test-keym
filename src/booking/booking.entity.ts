import { User, Booking } from '@prisma/client';

export class BookingEntity implements Booking {
  id!: string;
  hotel!: string;
  date!: Date;
  startTime!: Date;
  endTime!: Date;
  user!: User;
  userId!: string;
}
export { Booking };

