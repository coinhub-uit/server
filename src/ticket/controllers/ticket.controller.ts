import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.createTicket(createTicketDto);
  }

  @Get(':id/settlement')
  async settlementSettlement(@Param('id', ParseIntPipe) ticketId: number) {
    await this.ticketService.settlementTicket(ticketId);
  }
}
