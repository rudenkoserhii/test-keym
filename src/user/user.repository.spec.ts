import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userRepository.findById('1');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findById('2');
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userRepository.getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null if user not found by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUserData: Prisma.UserCreateInput = { email: 'newuser@example.com', password: 'password' };
      const mockUser = { id: '1', ...mockUserData };
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await userRepository.createUser(mockUserData);
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({ data: mockUserData });
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const where = { id: '1' };
      const data: Prisma.UserUpdateInput = { email: 'updated@example.com' };
      const updatedUser = { id: '1', email: 'updated@example.com' };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await userRepository.updateUser(where, data);
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({ where, data });
    });

    it('should return null if user not found to update', async () => {
      const where = { id: '1' };
      const data: Prisma.UserUpdateInput = { email: 'updated@example.com' };
      mockPrismaService.user.update.mockResolvedValue(null);

      const result = await userRepository.updateUser(where, data);
      expect(result).toBeNull();
    });
  });
});
