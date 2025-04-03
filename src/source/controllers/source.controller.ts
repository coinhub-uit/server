import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from 'src/source/services/source.service';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get all tickets of source',
    description: 'Get all tickets of source with source id',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: [TicketEntity],
  })
  @UseGuards(UserJwtAuthGuard)
  @Get(':id/tickets')
  getTickets(@Param() id: string) {
    try {
      const tickets = this.sourceService.getTickets(id);
      return tickets;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Create source in user',
    description: 'Create source for user with user id',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: SourceEntity,
  })
  @UseGuards(UserJwtAuthGuard)
  @Post()
  async createSource(createSourceDto: CreateSourceDto) {
    const source = await this.sourceService.createSource(createSourceDto);
    return source;
  }
}
