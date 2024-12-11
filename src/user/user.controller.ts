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

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Patch('/')
  async update(@Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      const { email, name } = updateUserDto || {};
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }    
    
      const updatedUser = await this.userService.updateUser({ email }, { name });
      return res.status(HttpStatus.CREATED).json(updatedUser);
    } catch (error) {
      
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get('current')
  async current(@Req() req: Request, @Res() res: Response) {
    try {
      const { user: { email } = {} } = req || {};
      const user = await this.userService.getUserByEmail(email);
      if (user) {
        return res.status(HttpStatus.OK).json(user);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
    } catch ({ message }) {
    
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(message);
    }
  }
}
