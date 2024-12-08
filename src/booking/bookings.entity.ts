import { Comment, User, Booking } from '@prisma/client';

export default class BookingEntity implements Booking {
  readonly id!: string;

  readonly hotel!: string;

  readonly dateFrom!: Date;

  readonly dateTo!: Date;

  readonly user!: User;

  readonly userId!: string;

  readonly comments: Comment[];
}
