import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanService } from 'src/plan/services/plan.service';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get()
  getPlans(@Query('isDisabled') isDisabled: boolean) {
    return this.planService.getPlans(isDisabled);
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
