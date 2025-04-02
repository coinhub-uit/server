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
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin.jwt-auth.guard';
import { AdminJwtStrategy } from 'src/auth/strategies/admin.jwt.stategy';
import { CreatePlanDto } from 'src/plan/dtos/create-plan.dto';
import { UpdatePlanDto } from 'src/plan/dtos/update-user.dto';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
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
  @ApiOperation({
    description: 'Create new plan',
  })
  @ApiOkResponse({
    description: 'Successfully',
    example: { plan: PlanEntity, planHistory: PlanHistoryEntity },
  })
  @ApiConflictResponse({
    description:
      'This Plan with this day number is already existed, please try new one',
    example: new ConflictException(),
  })
  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async createPlan(createPlanDto: CreatePlanDto) {
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
  @ApiOperation({
    description: "Update plan and save it's new version to plan history",
  })
  @ApiOkResponse({
    description: 'Successful',
    example: { updatedPlan: PlanEntity, planHistory: PlanHistoryEntity },
  })
  @ApiNotFoundResponse({
    description: 'This plan is not exist, may you find another one?',
    example: new NotFoundException(),
  })
  @UseGuards(AdminJwtAuthGuard)
  @Post('update')
  async updatePlan(updatePlanDto: UpdatePlanDto) {
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
