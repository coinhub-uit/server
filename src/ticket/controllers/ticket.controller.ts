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
import { TicketRequestDto } from 'src/ticket/dtos/ticket.request.dto';
import { TicketResponseDto } from 'src/ticket/dtos/ticket.response.dto';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';
import { TicketService } from 'src/ticket/services/ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Create ticket',
    description: 'Create ticket of source in user account',
  })
  @ApiForbiddenResponse()
  @ApiCreatedResponse({
    type: TicketResponseDto,
  })
  @Post()
  create(
    @Req() req: Request & { user: UniversalJwtRequest },
    @Body() createTicketDto: TicketRequestDto,
  ) {
    if (!req.user.isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to create ticket in source which not exist in your account',
      );
    }
    return this.ticketService.createTicket(createTicketDto);
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
  async simulateMaturityCircle(@Param('id', ParseIntPipe) ticketId: number) {
    try {
      await this.ticketService.simulateMaturityCircle(ticketId);
    } catch (error) {
      if (error instanceof TicketNotExistException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
