import { Controller, Get, Param } from '@nestjs/common';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get(':id')
  getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(id);
  }

  @Get(':userId')
  getTicketByUserId(@Param('userId') userId: string) {
    return this.ticketService.getTicketByUserId(userId);
  }
}
