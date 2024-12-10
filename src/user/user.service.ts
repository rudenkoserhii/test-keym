import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from './user.repositoty';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * @desc Find a user by id
   * @param where Prisma.UserWhereUniqueInput
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  findById(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.userRepository.findById(where);
  }

  /**
   * @desc Find a user by params
   * @param params Prisma.UserFindFirstArgs
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  async getUserByEmail(params: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.userRepository.getUserByEmail(params);
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
   * @desc Find all users with pagination
   * @param where Prisma.UserWhereInput
   * @param orderBy Prisma.UserOrderByWithRelationInput
   * @returns Promise<PaginatorTypes.PaginatedResult<User>>
   */
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userRepository.updateUser(where, data);
  }
}
