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
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get all tickets of source',
    description: 'Get all tickets of source with source id',
  })
  @ApiNotFoundResponse({
    description: 'Source not found',
    example: new NotFoundException('Source not found'),
  })
  @ApiOkResponse({
    description: 'successful',
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
  @ApiOkResponse({
    description: 'Successfull',
    type: SourceEntity,
  })
  @ApiNotFoundResponse({
    description: "User doesn't exist to be created source",
    example: new NotFoundException("User doesn't exist to be created source"),
  })
  @UseGuards(UserJwtAuthGuard)
  @Post()
  async createSource(createSourceDto: CreateSourceDto) {
    try {
      const source = await this.sourceService.createSource(createSourceDto);
      return source;
    } catch (error) {
      if (error instanceof UserNotExistException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
