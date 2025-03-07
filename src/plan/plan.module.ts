import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestRateEntity } from 'src/plan/interest_rate/entities/interest_rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterestRateEntity])],
})
export class PlanModule {}
