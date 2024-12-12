import { Request } from 'express';
import { Body, Controller, Post, Get, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from 'auth/auth.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AuthDto, AuthForgotDto } from 'auth/dto';
import { AuthEntity } from 'auth/auth.entity';
import { CreateUserDto } from 'user/dto';

@ApiTags('Authorisation')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @desc Registers a new user by creating an account with email and password.
   * @param {CreateUserDto} userDto - The user details required for registration (email, password, name, etc.).
   * @returns {Promise<UserEntity>} - The created user object including the JWT token for authentication.
   * @throws {HttpException} - Throws an exception if the email already exists in the system.
   */  
  @ApiOperation({ summary: 'Sign Up for user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthEntity, description: 'User signed up' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Post('signup')
  registration(@Body() userDto: CreateUserDto): Promise<AuthEntity> {
    return this.authService.registration(userDto);
  }

  /**
   * @desc Logs in an existing user by validating their credentials and providing a JWT token for access.
   * @param {AuthDto} data - The login credentials (email and password) of the user.
   * @returns {Promise<AuthEntity>} - The logged-in user object along with a JWT token.
   * @throws {UnauthorizedException} - Throws an exception if the email or password is incorrect.
   */
  @ApiOperation({ summary: 'Log In for user' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthEntity, description: 'User logged in' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Post('login')
  login(@Body() data: AuthDto): Promise<AuthEntity> {
    return this.authService.login(data);
  }

  /**
   * @desc Allows a user to reset their password by providing their email and a new password.
   * @param {AuthForgotDto} authForgotDto - The email and new password provided by the user for resetting their password.
   * @returns {Promise<UserEntity>} - The updated user object along with a new JWT token after password reset.
   * @throws {HttpException} - Throws an exception if the email does not exist in the system.
   */
  @ApiOperation({ summary: 'User forgot a password' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthEntity, description: 'Password updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Post('forgot')
  forgot(@Body() authForgotDto: AuthForgotDto): Promise<AuthEntity> {
    return this.authService.forgot(authForgotDto);
  }

  /**
   * @desc Logs out the current user by destroying the user's session.
   * @param {Request} req - The HTTP request object containing the user's session.
   * @returns {Object} - A message indicating the user has been logged out.
   * @throws {HttpException} - Throws an exception if the session cannot be destroyed.
   */
  @ApiOperation({ summary: 'LogOut for user' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged out' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request): object {
    req.session.destroy(function () {
      delete req.session;
    });
    return { message: 'User session has ended' };
  }
}
