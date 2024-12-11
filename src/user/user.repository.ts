import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * @desc Find a user by id
   * @param id string
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } }) || null;
  }

  /**
   * @desc Find a user by email
   * @param email string
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({where: { email }}) || null;
  }

  /**
   * @desc Create a new user
   * @param data Prisma.UserCreateInput
   * @returns Promise<User>
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * @desc Update user data
   * @param where Prisma.UserWhereInput
   * @param data Prisma.UserUpdateInput
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    return this.prisma.user.update({
      where,
      data,
    }) || null;
  }
}
