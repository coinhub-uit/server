import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { CreateSourceDto } from 'src/source/dtos/source.request.dto';
import { SourceResponseDto } from 'src/source/dtos/source.response.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from 'src/source/services/source.service';
import { TicketResponseDto } from 'src/ticket/dtos/ticket.response.dto';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Create source',
  })
  @ApiNotFoundResponse()
  @ApiCreatedResponse({
    type: SourceEntity,
  })
  @Post()
  async createSource(@Body() createSourceDto: CreateSourceDto) {
    return await this.sourceService.createSource(createSourceDto);
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get source',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [SourceResponseDto] })
  @Get(':id')
  async getById(@Param('id') sourceId: string) {
    return this.sourceService.find(sourceId);
  }

  // TODO: Add delete source later (NOT IMPORTANT) so later

  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: "Get all source's tickets",
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: [TicketResponseDto],
  })
  @UseGuards(UniversalJwtAuthGuard)
  @Get(':id/tickets')
  async getTickets(@Param() id: string) {
    return await this.sourceService.findTicketsBySourceId(id);
  }
}
