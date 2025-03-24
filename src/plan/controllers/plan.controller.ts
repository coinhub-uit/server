import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanService } from 'src/plan/services/plan.service';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get()
  getPlans(@Query('isActive') isActive: boolean) {
    return this.planService.getPlans(isActive);
  }

  @Get(':id')
  getPlanById(@Param('id') id: string) {
    return this.planService.getPlanById(id);
  }
}
