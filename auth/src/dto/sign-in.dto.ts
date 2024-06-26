import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class SignInDto implements Prisma.UserCreateInput {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Password1234',
  })
  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}
