import { All, Body, Controller, Get, Post, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
}
