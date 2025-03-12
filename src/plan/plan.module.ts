import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { InterestRateEntity } from 'src/plan/interest_rate/entities/interest_rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterestRateEntity, PlanEntity])],
})
export class PlanModule {}
