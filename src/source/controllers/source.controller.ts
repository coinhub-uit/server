import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceStillHasMoneyException } from 'src/source/exceptions/source-still-has-money.exceptions';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { SourceService } from 'src/source/services/source.service';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Create source',
  })
  @ApiNotFoundResponse()
  @ApiCreatedResponse({
    type: SourceEntity,
  })
  @Post()
  async createSource(
    @Req()
    req: Request & {
      user: UserJwtRequest;
    },
    @Body() createSourceDto: CreateSourceDto,
  ) {
    return await this.sourceService.createSource(
      createSourceDto,
      req.user.userId,
    );
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Get source',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [SourceEntity] })
  @Get(':id')
  async getById(@Param('id') sourceId: string) {
    return this.sourceService.find(sourceId);
  }

  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: 'Delete source by id',
  })
  @ApiNotFoundResponse()
  @ApiConflictResponse({
    description: 'Source mays still have money',
  })
  @Delete(':id')
  async delete(@Param('id') sourceId: string) {
    try {
      return this.sourceService.deleteSourceById(sourceId);
    } catch (error) {
      if (error instanceof SourceNotExistException) {
        throw new NotFoundException('source not exist');
      }
      if (error instanceof SourceStillHasMoneyException) {
        throw new ConflictException('source still has money');
      }
      throw error;
    }
  }

  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({
    summary: "Get all source's tickets + ticket history",
    description: 'Note that it will fetch allllllllll data, no filter anything',
  })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: [TicketEntity],
  })
  @UseGuards(UniversalJwtAuthGuard)
  @Get(':id/tickets')
  async getTickets(@Param('id') sourceId: string) {
    return await this.sourceService.findTicketsBySourceId(sourceId);
  }
}
