import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { CreateSourceDto } from 'src/source/dtos/create-source.dto';
import { SourceService } from 'src/source/services/source.service';

@Controller('sources')
export class SourceController {
  constructor(private sourceService: SourceService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get user's source",
    description: 'Get all sources of user',
  })
  @UseGuards(UniversalJwtAuthGuard)
  @Get(':userId')
  getSourcesByUserId(@Param('userId') userId: string) {
    return this.sourceService.getSourceByUserId(userId);
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
