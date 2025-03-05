import { Module } from '@nestjs/common';
import { InterestRateModule } from './interest_rate/interest_rate.module';

@Module({
  imports: [InterestRateModule],
})
export class PlanModule {}
