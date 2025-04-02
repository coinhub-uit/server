import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get(':id')
  getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(id);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }
}
