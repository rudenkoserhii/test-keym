import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private jwtService: JwtService,
  ) { }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (candidate) {
      throw new HttpException(
        'User with such e-mail is exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.prisma.user.create({
      data: {
        ...userDto,
        password: hashPassword,
      }
    });
    return this.generateToken(user);
  }

  async login(data: AuthDto) {
    const user = await this.validateUser(data);
    return this.generateToken(user);
  }

  async forgot(userDto: CreateUserDto) {
    const candidate = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (!candidate) {
      throw new HttpException(
        'No user with such e-mail',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.prisma.user.update({
      where: { email: userDto.email },
      data: { password: hashPassword },
    }
    );
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
      user: user,
    };
  }

  private async validateUser(data: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    const passwordEquals = await bcrypt.compare(data.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Wrong e-mail or password',
    });
  }
}
