import { Module } from '@nestjs/common';
import { PlanInterestRateService } from './plan-interest-rate.service';
import { PlanInterestRateController } from './plan-interest-rate.controller';

@Module({
  controllers: [PlanInterestRateController],
  providers: [PlanInterestRateService],
})
export class PlanInterestRateModule {}
