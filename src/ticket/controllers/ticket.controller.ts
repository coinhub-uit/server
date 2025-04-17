import {
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
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';

@Controller('tickets')
export class TicketController {
  constructor() {}

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
  create(
    @Req() req: Request & { user: UniversalJwtRequest },
    //  @Body() createTicketDto: CreateTicketDto,
  ) {
    if (!req.user.isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to create ticket in source which not exist in your account',
      );
    }
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
      await Promise.resolve(ticketId);
      // await this.ticketService.settlementTicket(ticketId);
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
      await Promise.resolve([endDate, ticketId]);
      // await this.ticketService.simulateSettlementTicket(ticketId, endDate);
    } catch (error) {
      if (error instanceof TicketNotExistException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
