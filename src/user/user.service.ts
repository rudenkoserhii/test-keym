import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { UserRepository } from 'user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * @desc Find a user by id
   * @param id string
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  findById(id: string): Promise<User> {
    return this.userRepository.findById(id) || null;
  }

  /**
   * @desc Find a user by params
   * @param email string
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUserByEmail(email) || null;
  }

  /**
   * @desc Create a new user
   * @param data Prisma.UserCreateInput
   * @returns Promise<User>
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.createUser(data);
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
    return this.userRepository.updateUser(where, data) || null;
  }
}
