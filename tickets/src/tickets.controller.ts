import { All, Body, Controller, Get, Post, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad Request. The request body does not contain the required fields, or validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Something went wrong on the server side.',
  })
  async createTicket(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).send({ message: 'Ticket created successfully.' });
  }
}
