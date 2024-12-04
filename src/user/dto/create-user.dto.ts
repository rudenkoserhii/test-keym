import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.com', description: 'Mailbox' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Wrong e-mail' })
  readonly email: string;
  @ApiProperty({ example: '12345', description: 'password' })
  @IsString({ message: 'Must be a number' })
  @Length(4, 16, { message: 'More than 4 & Less than 16' })
  readonly password: string;
}
Object.defineProperty(CreateUserDto, 'name', {
  value: 'User Create',
});
