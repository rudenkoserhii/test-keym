import { Request } from 'express';
import { Body, Controller, Post, Get, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from 'auth/auth.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AuthDto, AuthForgotDto } from 'auth/dto';
import { AuthEntity } from 'auth/auth.entity';
import { CreateUserDto } from 'user/dto';
import { MESSAGES } from 'constants/messages.enum';
import { ROUTES } from 'constants/routes.enum';
import { DESCRIPTIONS } from 'constants/descriptions.enum';
import { SWAGGER } from 'constants/swagger.enum';

@ApiTags(SWAGGER.AUTH.CONTROLLER.TAGS)
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @desc Registers a new user by creating an account with email and password.
   * @param {CreateUserDto} userDto - The user details required for registration (email, password, name, etc.).
   * @returns {Promise<UserEntity>} - The created user object including the JWT token for authentication.
   * @throws {HttpException} - Throws an exception if the email already exists in the system.
   */  
  @ApiOperation({ summary: SWAGGER.AUTH.CONTROLLER.OPERATION_SIGN_UP })
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthEntity, description: DESCRIPTIONS.SIGNED_UP })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @Post(ROUTES.SIGN_UP)
  registration(@Body() userDto: CreateUserDto): Promise<AuthEntity> {
    return this.authService.registration(userDto);
  }

  /**
   * @desc Logs in an existing user by validating their credentials and providing a JWT token for access.
   * @param {AuthDto} data - The login credentials (email and password) of the user.
   * @returns {Promise<AuthEntity>} - The logged-in user object along with a JWT token.
   * @throws {UnauthorizedException} - Throws an exception if the email or password is incorrect.
   */
  @ApiOperation({ summary: SWAGGER.AUTH.CONTROLLER.OPERATION_LOG_IN })
  @ApiResponse({ status: HttpStatus.OK, type: AuthEntity, description: DESCRIPTIONS.LOGGED_IN })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @Post(ROUTES.LOG_IN)
  login(@Body() data: AuthDto): Promise<AuthEntity> {
    return this.authService.login(data);
  }

  /**
   * @desc Allows a user to reset their password by providing their email and a new password.
   * @param {AuthForgotDto} authForgotDto - The email and new password provided by the user for resetting their password.
   * @returns {Promise<UserEntity>} - The updated user object along with a new JWT token after password reset.
   * @throws {HttpException} - Throws an exception if the email does not exist in the system.
   */
  @ApiOperation({ summary: SWAGGER.AUTH.CONTROLLER.OPERATION_FORGOT })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthEntity, description: DESCRIPTIONS.PASSWORD_UPDATED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  @Post(ROUTES.FORGOT)
  forgot(@Body() authForgotDto: AuthForgotDto): Promise<AuthEntity> {
    return this.authService.forgot(authForgotDto);
  }

  /**
   * @desc Logs out the current user by destroying the user's session.
   * @param {Request} req - The HTTP request object containing the user's session.
   * @returns {Object} - A message indicating the user has been logged out.
   * @throws {HttpException} - Throws an exception if the session cannot be destroyed.
   */
  @ApiOperation({ summary: SWAGGER.AUTH.CONTROLLER.OPERATION_LOG_OUT })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: DESCRIPTIONS.LOGGED_OUT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.LOG_OUT)
  logout(@Req() req: Request): object {
    req.session.destroy(function () {
      delete req.session;
    });
    return { message: MESSAGES.SESSION_ENDED };
  }
}
