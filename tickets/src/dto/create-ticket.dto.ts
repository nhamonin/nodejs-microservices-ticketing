import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length, Matches } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateTicketDto implements Prisma.TicketsCreateInput {
  @ApiProperty({
    example: 'Test',
  })
  @IsString()
  @Length(1, 50)
  title: string;

  @ApiProperty({ example: '100' })
  @IsNumberString()
  @Matches(/^(?!0*(\.0+)?$)\d+(\.\d+)?$/, {
    message: 'price must be a positive number string greater than zero',
  })
  price: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @Length(36, 36)
  userId: string;
}
