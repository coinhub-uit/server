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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { NotAllowedToCreateTicketFromOtherSourceException } from 'src/ticket/exceptions/not-allowed-to-create-ticket-from-other-source.exception';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'get ticket by id',
  })
  @ApiNotFoundResponse()
  @ApiCreatedResponse({
    type: TicketEntity,
  })
  @Post(':id')
  getById(
    @Param('id') ticketId: number,
    @Req() req: Request & { user: UniversalJwtRequest },
  ) {
    try {
      return this.ticketService.getById(
        ticketId,
        req.user.isAdmin || req.user.userId,
      );
    } catch (e) {
      if (e instanceof TicketNotExistException) {
        throw new NotFoundException('Ticket not found');
      }
      throw e;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Create ticket',
    description: 'Create ticket of source in user account',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse({
    description: "Cannot create ticket on other user's source",
  })
  @ApiCreatedResponse({
    type: TicketEntity,
  })
  @Post()
  create(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() createTicketDto: CreateTicketDto,
  ) {
    try {
      return this.ticketService.createTicket(
        createTicketDto,
        req.user.isAdmin || req.user.userId,
      );
      // TODO: Catch cannot create other's source ticket
    } catch (e) {
      if (e instanceof NotAllowedToCreateTicketFromOtherSourceException) {
        throw new ForbiddenException(e.message);
      } else if (
        e instanceof PlanHistoryNotExistException ||
        e instanceof SourceNotExistException
      ) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'withdraw ticket',
    description: 'withdraw ticket of source in user account',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':id/withdraw')
  async withdrawTicket(@Param('id', ParseIntPipe) ticketId: number) {
    try {
      await this.ticketService.withdrawTicket(ticketId);
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
    summary: 'simulate mature ticket',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':id/simulate-mature')
  async simulateMaturityCircle(@Param('id', ParseIntPipe) ticketId: number) {
    try {
      await this.ticketService.simulateMature(ticketId);
    } catch (error) {
      if (error instanceof TicketNotExistException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
