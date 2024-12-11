import { Request } from 'express';
import { Body, Controller, Post, Get, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from 'auth/auth.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AuthDto, AuthForgotDto } from 'auth/dto';
import { UserEntity } from 'user/user.entity';
import { CreateUserDto } from 'user/dto';

@ApiTags('Authorisation')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Sign Up for user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserEntity, description: 'User signed up' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Post('signup')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
  @ApiOperation({ summary: 'Log In for user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity, description: 'User logged in' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }
  @ApiOperation({ summary: 'User forgot a password' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: UserEntity, description: 'Password updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Post('forgot')
  forgot(@Body() authForgotDto: AuthForgotDto) {
    return this.authService.forgot(authForgotDto);
  }
  @ApiOperation({ summary: 'LogOut for user' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged out' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.session.destroy(function () {
      delete req.session;
    });
    return { message: 'User session has ended' };
  }
}
