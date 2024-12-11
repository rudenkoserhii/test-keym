import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from 'user/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'user@mail.com', description: 'Mailbox', required: false })
  readonly email?: string;

  @ApiProperty({ example: '12345', description: 'password', required: false })
  readonly password?: string;

  @ApiProperty({ example: 'John', description: 'name', required: false })
  readonly name?: string;
}

Object.defineProperty(UpdateUserDto, 'name', {
  value: 'User Update',
});