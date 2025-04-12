import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Create ticket',
    description: 'Create ticket of source in user account',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse()
  @Post()
  async create(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() createTicketDto: CreateTicketDto,
  ) {
    if (
      !req.user.isAdmin &&
      createTicketDto.sourceId in req.user.sourceIdList!
    ) {
      throw new ForbiddenException(
        "You are not allowed to create ticket in other user's profile",
      );
    }
    const ticket = await this.ticketService.createTicket(createTicketDto);
    return {
      ticket: await this.ticketService.createTicket(createTicketDto),
      firstTicketHistory: await this.ticketService.createTicketHistory(
        ticket,
        createTicketDto,
      ),
    };
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'settlement ticket',
    description: 'settlement ticket of source in user account',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':id/settlement')
  async settlementTicket(@Param('id', ParseIntPipe) ticketId: number) {
    await this.ticketService.settlementTicket(ticketId);
  }
}
