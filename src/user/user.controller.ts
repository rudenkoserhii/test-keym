import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { UserEntity } from 'user/user.entity';
import { UserService } from 'user/user.service';
import { UpdateUserDto } from 'user/dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 201, type: UserEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Patch('/')
  async update(@Body() updateUserDto: UpdateUserDto, @Res() res: any) {
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
  @ApiResponse({ status: 200, type: UserEntity })
  @ApiResponse({ status: 404, description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get('current')
  async current(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.userService.getUserByEmail(req.user.email);
      if (user) {
        return res.status(HttpStatus.OK).json(user);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
    } catch (error) {
    
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
