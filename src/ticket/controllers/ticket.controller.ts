import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
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
import { SourceService } from 'src/source/services/source.service';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private sourceService: SourceService,
  ) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Create ticket',
    description: 'Create ticket of source in user account',
  })
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
        'You are not allowed to create ticket in source which not exist in your account',
      );
    }
    const ticket = await this.ticketService.createTicket(createTicketDto);
    await this.sourceService.changeSourceBalanceById(
      createTicketDto.sourceId,
      -createTicketDto.amount,
    );
    return {
      ticket: ticket,
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
  async settlementTicket(@Param('id', ParseIntPipe) ticketId: string) {
    try {
      await this.ticketService.settlementTicket(ticketId);
    } catch (error) {
      if (error instanceof TicketNotExistException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: ' settlement ticket',
    description: 'settlement ticket of source in user account',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':id/:endDate/simulate-settlement')
  async simulateSettlementTicket(
    @Param('id', ParseIntPipe) ticketId: string,
    @Param('endDate') endDate: Date,
  ) {
    try {
      await this.ticketService.simulateSettlementTicket(ticketId, endDate);
    } catch (error) {
      if (error instanceof TicketNotExistException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
