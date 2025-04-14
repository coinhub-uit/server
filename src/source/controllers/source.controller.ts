import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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

  // TODO: Add get source by id @NTGNguyen aslkfdj;lkasjdf;
  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get source',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [SourceEntity] })
  @Get()
  async getById() {}

  // TODO: Add delete source later (NOT IMPORTANT) so later

  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: "Get all source's tickets",
  })
  @ApiUnprocessableEntityResponse()
  @ApiOkResponse({
    type: [TicketEntity],
  })
  @UseGuards(UniversalJwtAuthGuard)
  @Get(':id/tickets')
  async getTickets(@Param() id: string) {
    return await this.sourceService.getTickets(id);
  }
}
