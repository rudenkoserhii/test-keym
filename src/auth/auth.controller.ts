import { Request } from 'express';
import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from 'auth/auth.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AuthDto } from 'auth/dto';
import { UserEntity } from 'user/user.entity';
import { CreateUserDto } from 'user/dto';

@ApiTags('Authorisation')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Sign Up for user' })
  @ApiResponse({ status: 201, type: [UserEntity] })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Post('signup')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
  @ApiOperation({ summary: 'Log In for user' })
  @ApiResponse({ status: 200, type: [UserEntity] })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Post('login')
  login(@Body() data: AuthDto) {
    console.log(data);
    return this.authService.login(data);
  }
  @ApiOperation({ summary: 'User forgot a password' })
  @ApiResponse({ status: 201, type: [UserEntity] })
  @UseGuards(JwtAuthGuard)
  @Post('forgot')
  forgot(@Body() userDto: CreateUserDto) {
    return this.authService.forgot(userDto);
  }
  @ApiOperation({ summary: 'LogOut for user' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.session.destroy(function () {
      delete req.session;
    });
    return { msg: 'User session has ended' };
  }
}
