import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import User from '../user/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User }) // Update response type to User
  @Post()
  async create(@Body() userDto: CreateUserDto, @Res() res: any) {
    try {
      const user = await this.userService.createUser(userDto);
      return res.status(HttpStatus.CREATED).json(user); // Use response object
    } catch (error) {
      // Handle potential errors during creation (optional)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: User }) // Update response type to User
  @UseGuards(JwtAuthGuard)
  @Get('current')
  async current(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.userService.getUserByEmail(req.user.email);
      if (user) {
        return res.status(HttpStatus.OK).json(user);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }
    } catch (error) {
      // Handle potential errors during retrieval (optional)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}