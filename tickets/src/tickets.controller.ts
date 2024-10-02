import { Controller, Post, HttpStatus, Req, UseGuards, Body, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';

import { Request } from 'express';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

class CreateTicketWithoutUserIdDto extends OmitType(CreateTicketDto, ['userId'] as const) {}

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tickets fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Something went wrong on the server side.',
  })
  async getTickets() {
    return this.ticketsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiBody({
    description: 'Create Ticket DTO',
    type: CreateTicketWithoutUserIdDto,
    examples: {
      example1: {
        summary: 'Example Ticket',
        value: {
          title: 'Concert Ticket',
          price: '50',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ticket created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad Request. The request body does not contain the required fields, or validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Invalid or missing token.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Something went wrong on the server side.',
  })
  async createTicket(@Req() req: Request, @Body() ticketDto: CreateTicketWithoutUserIdDto) {
    return this.ticketsService.create({
      ...ticketDto,
      userId: req.currentUser.id,
    });
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid ticket ID provided.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Something went wrong on the server side.',
  })
  async getTicket(@Param('id') id: string) {
    return this.ticketsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiBody({
    description: 'Update Ticket DTO',
    type: UpdateTicketDto,
    examples: {
      example1: {
        summary: 'Example Update',
        value: {
          title: 'Updated Concert Ticket',
          price: '75',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. The request body does not contain the required fields, or validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Invalid or missing token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Something went wrong on the server side.',
  })
  async updateTicket(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Req() req: Request) {
    return this.ticketsService.update(id, updateTicketDto, req.currentUser.id);
  }
}
