import { User, Booking } from '@prisma/client';

export class BookingEntity implements Booking {
  id!: string;
  hotel!: string;
  dateFrom!: Date;
  dateTo!: Date;
  user!: User;
  userId!: string;
}
export { Booking };

