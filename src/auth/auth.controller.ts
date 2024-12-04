import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authorisation')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: [User] })
  @Post('signup')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: [User] })
  @Post('login')
  login(@Body() data: AuthDto) {
    console.log(data);
    return this.authService.login(data);
  }
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Post('forgot')
  forgot(@Body() userDto: CreateUserDto) {
    return this.authService.forgot(userDto);
  }
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.session.destroy(function () {
      delete req.session;
    });
    return { msg: 'The user session has ended' };
  }
}
