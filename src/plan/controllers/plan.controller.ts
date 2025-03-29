import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanService } from 'src/plan/services/plan.service';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService) {}
  @Get()
  findAvailablePlan() {
    return this.planService.getAvailablePlans();
  }

  @Get()
  getPlans(@Query('isActive') isActive: boolean) {
    return this.planService.getPlans(isActive);
  }

  @Get(':id')
  getPlanById(@Param('id') id: string) {
    return this.planService.getPlanById(id);
  }

  @Get()
  findAll(
    @Query('days') days: number,
    @Query('isDisabled') isDisabled: boolean,
  ) {
    return this.planService.getAll(days, isDisabled);
  }
}
