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

const SALT = 5;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (candidate) {
      throw new HttpException(
        'User with such e-mail exists',
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

  async login(data: AuthDto) {    
    const user = await this.validateUser(data);
    return this.generateToken(user);
  }

  async forgot(authForgotDto: AuthForgotDto) {
    const { email, password } = authForgotDto || {};
    const candidate = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!candidate) {
      throw new HttpException(
        'No user with such e-mail',
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

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  private async validateUser(data: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException({
        message: 'The user not exists',
      });
    }
    
    const passwordEquals = await bcrypt.compare(data.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Wrong e-mail or password',
    });
  }
}
