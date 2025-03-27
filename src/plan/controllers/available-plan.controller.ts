import { Controller, Get } from '@nestjs/common';
import { AvailablePlanService } from 'src/plan/services/available-plan.service';

@Controller('available-plans')
export class AvailablePlanController {
  constructor(private availablePlanService: AvailablePlanService) {}

  @Get()
  findAvailablePlan() {
    return this.availablePlanService.getAvailablePlans();
  }
}
