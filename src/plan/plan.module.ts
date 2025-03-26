import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanService } from './services/plan.service';
import { PlanController } from './controllers/plan.controller';
import { AvailablePlanController } from './controllers/available-plan.controller';
import { AvailablePlanService } from 'src/plan/services/available-plan.service';
import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanHistoryEntity,
      PlanEntity,
      AvailablePlanEntity,
    ]),
  ],
  providers: [PlanService, AvailablePlanService],
  controllers: [PlanController, AvailablePlanController],
})
export class PlanModule {}
