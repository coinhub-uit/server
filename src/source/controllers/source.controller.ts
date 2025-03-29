import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceService } from 'src/source/services/source.service';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all tickets of source',
    description: 'Get all tickets of source with source id',
  })
  @UseGuards(UserJwtAuthGuard)
  @Get(':id/tickets')
  getTickets(@Param() id: string) {
    return this.sourceService.getTickets(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create source in user',
    description: 'Create source for user with user id',
  })
  @UseGuards(UserJwtAuthGuard)
  @Post()
  createSource(createSourceDto: CreateSourceDto) {
    return this.sourceService.createSource(createSourceDto);
  }
}
