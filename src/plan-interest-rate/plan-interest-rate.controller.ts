import { Controller } from '@nestjs/common';
import { PlanInterestRateService } from './plan-interest-rate.service';
@Controller('plan-interest-rate')
export class PlanInterestRateController {
  constructor(
    private readonly planInterestRateService: PlanInterestRateService,
  ) {}
}
