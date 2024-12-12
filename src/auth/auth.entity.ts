import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from 'user';

export class AuthEntity {
  @ApiProperty({
    description: 'The user details object',
    type: UserEntity,
  })
  user!: UserEntity;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAbWFpbC5jb20iLCJpZCI6IjY3NTg2OTM3ZDZmOTAxMzQwMDIzMGJiNCIsImlhdCI6MTczMzkxMzU5NSwiZXhwIjoxNzM2NTA1NTk1fQ.sR7KNMadQcf4vy9DyLBONxeKyHjBmT_dBwW6spasN7E',
    description: 'The session token for user',
  })
  token!: string;
}
