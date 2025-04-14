import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  // TODO: maybe add query for getting all ticket history or not. Useful for admin to get all, and user only need latest
  @ApiOkResponse({ type: TicketEntity })
  @Get(':id')
  async getTicketById(@Param('id', ParseIntPipe) id: number) {
    return await this.ticketService.getTicketById(id);
  }

  @ApiCreatedResponse({ type: TicketEntity })
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.createTicket(createTicketDto);
  }
}
