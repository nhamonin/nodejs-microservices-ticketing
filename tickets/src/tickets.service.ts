import { Injectable } from '@nestjs/common';

import { NotFoundError, ForbiddenError } from '@nh_tickets/common';
import { PrismaService } from './services/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.tickets.findMany();
  }

  async getById(id: string) {
    const ticket = await this.prisma.tickets.findUnique({
      where: {
        id,
      },
    });

    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async create(data: CreateTicketDto) {
    return this.prisma.tickets.create({
      data,
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userId: string) {
    const ticket = await this.prisma.tickets.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${id} not found`);
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenError('You are not authorized to update this ticket');
    }

    return this.prisma.tickets.update({
      where: { id },
      data: updateTicketDto,
    });
  }
}
