import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  Patch,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { UserEntity } from 'user/user.entity';
import { UserService } from 'user/user.service';
import { UpdateUserDto } from 'user/dto';
import { ROUTES } from 'constants/routes.enum';
import { MESSAGES } from 'constants/messages.enum';
import { SWAGGER } from 'constants/swagger.enum';

@ApiTags(SWAGGER.USER.CONTROLLER.TAGS)
@Controller(ROUTES.USER)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * @desc Updates the user's name based on the provided email.
   * @param {UpdateUserDto} updateUserDto - The data used to update the user.
   * @param {Response} res - The response object to send the result back to the client.
   * @returns {Promise<void>} - The response with the updated user data or error message.
   * @throws {HttpException} - If the user is not found or if there is a server error.
   */
  @ApiOperation({ summary: SWAGGER.USER.CONTROLLER.UPDATE })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  @Patch(ROUTES.ROOT)
  async update(@Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      const { email, name } = updateUserDto || {};
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: MESSAGES.USER_NOT_FOUND });
      }    
    
      const updatedUser = await this.userService.updateUser({ email }, { name });
      return res.status(HttpStatus.CREATED).json(updatedUser);
    } catch (error) {
      
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  /**
   * @desc Fetches the currently authenticated user's data.
   * @param {Request} req - The request object containing user information.
   * @param {Response} res - The response object to send the result back to the client.
   * @returns {Promise<void>} - The response with the current user's data or error message.
   */
  @ApiOperation({ summary: SWAGGER.USER.CONTROLLER.GET_USER })
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MESSAGES.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.CURRENT)
  async current(@Req() req: Request, @Res() res: Response) {
    try {
      const { user: { email } = {} } = req || {};
      const user = await this.userService.getUserByEmail(email);
      if (user) {
        return res.status(HttpStatus.OK).json(user);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: MESSAGES.USER_NOT_FOUND });
      }
    } catch ({ message }) {
    
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(message);
    }
  }
}
