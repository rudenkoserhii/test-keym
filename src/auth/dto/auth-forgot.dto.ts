import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthForgotDto {
  @ApiProperty({ example: 'user@mail.com', description: 'Mailbox' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Wrong e-mail' })
  readonly email: string;
  
  @ApiProperty({ example: '123456', description: 'password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'More than 4 & Less than 16' })
  readonly password: string;
}
Object.defineProperty(AuthForgotDto, 'name', {
  value: 'User With new Password',
});
