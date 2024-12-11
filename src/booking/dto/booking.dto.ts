import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty({ example: 'user@mail.com', description: 'Mailbox' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Wrong e-mail' })
  readonly email: string;
  @ApiProperty({ example: '12345', description: 'password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'More than 4 & Less than 16' })
  readonly password: string;
}
Object.defineProperty(AuthDto, 'name', {
  value: 'User Sign In',
});
