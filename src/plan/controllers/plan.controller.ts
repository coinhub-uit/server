import {
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { AdminJwtStrategy } from 'src/auth/strategies/admin.jwt.stategy';
import { CreatePlanRequestDto } from 'src/plan/dtos/requests/create-plan.request.dto';
import { UpdatePlanRequestDto } from 'src/plan/dtos/requests/update-plan.request.dto';
import { CreatePlanResponseDto } from 'src/plan/dtos/responses/create-plan.response.dto';
import { UpdatePlanResponseDto } from 'src/plan/dtos/responses/update-plan.response.dto';
import { PlanNotExist } from 'src/plan/exceptions/plan-not-exist';
import { PlanService } from 'src/plan/services/plan.service';
import { UserAlreadyExistException } from 'src/user/exceptions/user-already-exist.exception';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService) {}
  @Get()
  findAvailablePlan() {
    return this.planService.getAvailablePlans();
  }

  @ApiBearerAuth('admin')
  @ApiOperation({})
  @ApiConflictResponse({})
  @ApiUnprocessableEntityResponse({})
  @ApiOkResponse({
    type: CreatePlanResponseDto,
  })
  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async createPlan(createPlanDto: CreatePlanRequestDto) {
    try {
      return await this.planService.createPlan(createPlanDto);
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new ConflictException(
          'This Plan with this day number is already existed, please try new one',
        );
      }
      throw error;
    }
  }

  @ApiBearerAuth('admin')
  @ApiOperation({})
  @ApiNotFoundResponse({})
  @ApiUnprocessableEntityResponse({})
  @ApiOkResponse({
    type: UpdatePlanResponseDto,
  })
  @UseGuards(AdminJwtAuthGuard)
  @Post('update')
  async updatePlan(updatePlanDto: UpdatePlanRequestDto) {
    try {
      const plan = await this.planService.findPlanByDays(updatePlanDto.days);
      return await this.planService.updatePlan(updatePlanDto, plan);
    } catch (error) {
      if (error instanceof PlanNotExist)
        throw new NotFoundException(
          'This plan is not exist, may you find another one?',
        );
      throw error;
    }
  }

  @ApiBearerAuth('admin')
  @UseGuards(AdminJwtStrategy)
  @Get()
  getPlans(@Query('isActive') isActive: boolean) {
    return this.planService.getPlans(isActive);
  }
}
