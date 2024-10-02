import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpdateTicketDto implements Prisma.TicketsUpdateInput {
  @ApiPropertyOptional({
    example: 'Test',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  title?: string;

  @ApiPropertyOptional({ example: '100' })
  @IsOptional()
  @IsNumberString()
  @Matches(/^(?!0*(\.0+)?$)\d+(\.\d+)?$/, {
    message: 'price must be a positive number string greater than zero',
  })
  price?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  @Length(36, 36)
  userId?: string;
}
