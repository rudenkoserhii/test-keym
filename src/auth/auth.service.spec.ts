import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { AuthDto, AuthForgotDto } from 'auth/dto';
import { AuthService } from 'auth/auth.service';
import { MESSAGES } from 'constants/messages.enum';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from 'user/dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let bcryptCompareMock: jest.Mock;
  let bcryptHashMock: jest.Mock;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
  };

  const mockAuthDto: AuthDto = {
    email: 'test@example.com',
    password: 'password',
  };

  const mockAuthForgotDto: AuthForgotDto = {
    email: 'test@example.com',
    password: 'new-password',
  };

  beforeEach(async () => {
    bcryptCompareMock = jest.fn();
    bcryptHashMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(bcrypt, 'compare').mockImplementation(bcryptCompareMock);
    jest.spyOn(bcrypt, 'hash').mockImplementation(bcryptHashMock);
  });

  describe('registration', () => {
    it('should register a new user and return a JWT token', async () => {
      bcryptHashMock.mockResolvedValue('hashed-password');
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue(mockUser);

      const result = await authService.registration(mockCreateUserDto);

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockCreateUserDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateUserDto,
          password: 'hashed-password',
        },
      });
    });

    it('should throw an error if the user already exists', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      await expect(authService.registration(mockCreateUserDto)).rejects.toThrow(
        new HttpException(MESSAGES.USER_EXISTS, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return a JWT token', async () => {
      bcryptCompareMock.mockResolvedValue(true);
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      const result = await authService.login(mockAuthDto);

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockAuthDto.email },
      });
    });

    it('should throw an UnauthorizedException if the user does not exist', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(authService.login(mockAuthDto)).rejects.toThrow(
        new UnauthorizedException({
          message: MESSAGES.USER_NOT_EXISTS,
        }),
      );
    });

    it('should throw an UnauthorizedException if the password is incorrect', async () => {
      bcryptCompareMock.mockResolvedValue(false);
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      await expect(authService.login(mockAuthDto)).rejects.toThrow(
        new UnauthorizedException({
          message: MESSAGES.WRONG_CREDENTIALS,
        }),
      );
    });
  });

  describe('forgot', () => {
    it('should reset password and return a JWT token', async () => {
      bcryptHashMock.mockResolvedValue('hashed-new-password');
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const result = await authService.forgot(mockAuthForgotDto);

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockAuthForgotDto.email },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { email: mockAuthForgotDto.email },
        data: { password: 'hashed-new-password' },
      });
    });

    it('should throw an error if the user does not exist', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(authService.forgot(mockAuthForgotDto)).rejects.toThrow(
        new HttpException(MESSAGES.USER_EMAIL_NOT_EXISTS, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token for the user', async () => {
      const result = await authService['generateToken'](mockUser);

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('validateUser', () => {
    it('should validate the user credentials successfully', async () => {
      bcryptCompareMock.mockResolvedValue(true);
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      const user = await authService['validateUser'](mockAuthDto);

      expect(user).toEqual(mockUser);
    });

    it('should throw an UnauthorizedException if the user does not exist', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(authService['validateUser'](mockAuthDto)).rejects.toThrow(
        new UnauthorizedException({
          message: MESSAGES.USER_NOT_EXISTS,
        }),
      );
    });

    it('should throw an UnauthorizedException if the password is incorrect', async () => {
      bcryptCompareMock.mockResolvedValue(false);
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      await expect(authService['validateUser'](mockAuthDto)).rejects.toThrow(
        new UnauthorizedException({
          message: MESSAGES.WRONG_CREDENTIALS,
        }),
      );
    });
  });
});
