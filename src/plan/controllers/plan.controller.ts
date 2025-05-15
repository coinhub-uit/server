import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { AdminJwtStrategy } from 'src/auth/strategies/admin.jwt.stategy';
import { UpdatePlanRateDto } from 'src/plan/dtos/update-plan-rate.dto';
import { AvailablePlanView } from 'src/plan/entities/available-plan.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanNotExistException } from 'src/plan/exceptions/plan-not-exist';
import { PlanService } from 'src/plan/services/plan.service';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Get available plans' })
  @ApiOkResponse({
    type: [AvailablePlanView],
  })
  @Get('available-plans')
  async getAvailablePlans() {
    return await this.planService.getAvailablePlans();
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Get plan by id' })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: [PlanEntity],
  })
  @Get(':id')
  async getPlan(
    @Param('id', ParseIntPipe) planId: number,
    @Query('allHistories', ParseBoolPipe) allHistories: boolean = false,
  ) {
    try {
      return await this.planService.findById(planId, allHistories);
    } catch (error) {
      if (error instanceof PlanNotExistException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Get plan history by id' })
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: [PlanHistoryEntity],
  })
  @Get('histories/:id')
  async getPlanHistory(@Param('id', ParseIntPipe) planHistoryId: number) {
    try {
      return await this.planService.findHistoryById(planHistoryId);
    } catch (error) {
      if (error instanceof PlanHistoryNotExistException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @ApiBearerAuth('admin')
  @ApiOperation({ summary: 'Update plan rate' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: PlanHistoryEntity,
  })
  @UseGuards(AdminJwtAuthGuard)
  @Post('histories')
  async updateRate(@Body() updatePlanRateDto: UpdatePlanRateDto) {
    try {
      return await this.planService.updateRate(updatePlanRateDto);
    } catch (error) {
      if (error instanceof PlanNotExistException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiBearerAuth('admin')
  @UseGuards(AdminJwtStrategy)
  @ApiOperation({ summary: 'Get all plans' })
  @ApiOkResponse({ type: [PlanEntity] })
  @Get()
  getAll() {
    return this.planService.findAll();
  }
}
