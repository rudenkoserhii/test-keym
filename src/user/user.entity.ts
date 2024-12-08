import { Address, User, Booking } from '@prisma/client';

export default class UserEntity implements User {
  readonly id!: string;

  readonly email!: string;

  readonly password!: string | null;

  readonly name!: string;

  readonly address: Address;

  readonly bookings: Booking[];
}
