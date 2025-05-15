import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanService } from './services/plan.service';
import { PlanController } from './controllers/plan.controller';
import { AvailablePlanEntity } from 'src/plan/entities/available-plan.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanHistoryEntity,
      PlanEntity,
      AvailablePlanEntity,
    ]),
    AuthModule, // TODO: Check do we need it here?
  ],
  providers: [PlanService],
  controllers: [PlanController],
  exports: [PlanService, TypeOrmModule],
})
export class PlanModule {}
