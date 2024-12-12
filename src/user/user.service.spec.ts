import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findById: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById('1');
      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.findById('2');
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user not found by email', async () => {
      mockUserRepository.getUserByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUserData: Prisma.UserCreateInput = { email: 'newuser@example.com', password: 'password' };
      const mockUser = { id: '1', ...mockUserData };
      mockUserRepository.createUser.mockResolvedValue(mockUser);

      const result = await userService.createUser(mockUserData);
      expect(result).toEqual(mockUser);
      expect(userRepository.createUser).toHaveBeenCalledWith(mockUserData);
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const where = { id: '1' };
      const data: Prisma.UserUpdateInput = { email: 'updated@example.com' };
      const updatedUser = { id: '1', email: 'updated@example.com' };

      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(where, data);
      expect(result).toEqual(updatedUser);
      expect(userRepository.updateUser).toHaveBeenCalledWith(where, data);
    });

    it('should return null if user not found to update', async () => {
      const where = { id: '1' };
      const data: Prisma.UserUpdateInput = { email: 'updated@example.com' };
      mockUserRepository.updateUser.mockResolvedValue(null);

      const result = await userService.updateUser(where, data);
      expect(result).toBeNull();
    });
  });
});
