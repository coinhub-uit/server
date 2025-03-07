import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticEntity } from 'src/statistic/entities/statistic.entity';

@Module({ imports: [TypeOrmModule.forFeature([StatisticEntity])] })
export class StatisticModule {}
