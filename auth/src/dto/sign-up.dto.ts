import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class SignUpDto implements Prisma.UserCreateInput {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'invalid email address' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Password1234',
  })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 0,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter.',
    },
  )
  @MaxLength(32)
  password: string;
}
