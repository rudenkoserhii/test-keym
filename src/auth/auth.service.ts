import * as bcrypt from 'bcryptjs';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { AuthDto, AuthForgotDto } from 'auth/dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from 'user/dto';
import { AuthEntity } from 'auth/auth.entity';
import { MESSAGES } from 'constants/messages.enum';

const SALT = 5;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * @desc Registers a new user. Checks if the user already exists by email and creates a new user if not.
   * @param {CreateUserDto} userDto - The user data for registration, including email, password, and name.
   * @returns {Promise<AuthEntity>} - A JWT token and the created user object.
   * @throws {HttpException} - Throws an error if a user with the provided email already exists.
   */
  async registration(userDto: CreateUserDto): Promise<AuthEntity> {
    const candidate = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (candidate) {
      throw new HttpException(
        MESSAGES.USER_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, SALT);
    const user = await this.prisma.user.create({
      data: {
        ...userDto,
        password: hashPassword,
      },
    });
    return this.generateToken(user);
  }

  /**
   * @desc Logs in an existing user by validating the user's credentials.
   * @param {AuthDto} data - The login credentials, including the email and password.
   * @returns {Promise<AuthEntity>} - A JWT token and the authenticated user object.
   * @throws {UnauthorizedException} - Throws if the user does not exist or if the password is incorrect.
   */  
  async login(data: AuthDto): Promise<AuthEntity> {    
    const user = await this.validateUser(data);
    return this.generateToken(user);
  }

  /**
   * @desc Allows a user to reset their password.
   * @param {AuthForgotDto} authForgotDto - The email and new password for resetting.
   * @returns {Promise<AuthEntity>} - A JWT token and the updated user object.
   * @throws {HttpException} - Throws an error if no user exists with the provided email.
   */  
  async forgot(authForgotDto: AuthForgotDto): Promise<AuthEntity> {
    const { email, password } = authForgotDto || {};
    const candidate = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!candidate) {
      throw new HttpException(
        MESSAGES.USER_EMAIL_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(password, SALT);
    const user = await this.prisma.user.update({
      where: { email },
      data: { password: hashPassword },
    });
    return this.generateToken(user);
  }

  /**
   * @desc Generates a JWT token for the user after successful registration or login.
   * @param {User} user - The user object containing email and id.
   * @returns {Promise<{ token: string, user: User }>} - The generated JWT token and the user object.
   */  
  private async generateToken(user: User): Promise<{ token: string; user: User; }> {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * @desc Validates the user's credentials by checking the email and password.
   * @param {AuthDto} data - The login credentials (email and password).
   * @returns {Promise<User>} - The authenticated user object if valid.
   * @throws {UnauthorizedException} - Throws an error if the user does not exist or the password is incorrect.
   */  
  private async validateUser(data: AuthDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException({
        message: MESSAGES.USER_NOT_EXISTS,
      });
    }
    
    const passwordEquals = await bcrypt.compare(data.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: MESSAGES.WRONG_CREDENTIALS,
    });
  }
}
