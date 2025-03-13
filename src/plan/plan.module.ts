import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanHistoryEntity, PlanEntity])],
})
export class PlanModule {}
