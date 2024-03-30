import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'invalid email address' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: 'password1234',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
