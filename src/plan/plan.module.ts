import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan_history.entity';
import { PlanService } from './services/plan.service';
import { PlanController } from './controllers/plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlanHistoryEntity, PlanEntity])],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
