import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from 'src/source/services/source.service';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}

  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Create source',
    description: 'Create source',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: SourceEntity,
  })
  @UseGuards(UniversalJwtAuthGuard)
  @Post()
  async createSource(@Body() createSourceDto: CreateSourceDto) {
    const source = await this.sourceService.createSource(createSourceDto);
    return source;
  }

  // TODO: Add get source by id @NTGNguyen aslkfdj;lkasjdf;

  // TODO: Add delete source later (NOT IMPORTANT) so later

  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get all tickets of source',
    description: 'Get all tickets of source with source ID',
  })
  @ApiUnprocessableEntityResponse()
  @ApiOkResponse({
    type: [TicketEntity],
  })
  @UseGuards(UniversalJwtAuthGuard)
  @Get(':id/tickets')
  async getTickets(@Param() id: string) {
    const tickets = await this.sourceService.getTickets(id);
    return tickets;
  }
}
