import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.model';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: [User] })
  @Post()
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get('current')
  current(@Req() req: any) {
    return this.userService.getUserByEmail(req.user.email);
  }
}
