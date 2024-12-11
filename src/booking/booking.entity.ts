import { User, Booking } from '@prisma/client';

export class BookingEntity implements Booking {
  id!: string;
  hotel!: string;
  startDate!: Date;
  endDate!: Date;
  user!: User;
  userId!: string;
}
export { Booking };

