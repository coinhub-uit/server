import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { SourceModule } from 'src/user/source/source.module';
import { TransactionModule } from './transaction/transaction.module';
import { PlanModule } from './plan/plan.module';
import { TicketModule } from './ticket/ticket.module';
import { MethodModule } from './method/method.module';
import { AdminModule } from './admin/admin.module';
import { StatisticModule } from './statistic/statistic.module';
import { SettingModule } from './setting/setting.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlanInterestRateModule } from './plan-interest-rate/plan-interest-rate.module';
import databaseConfig from 'src/config/database.config';
import jwtConfig from 'src/config/jwt.config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, jwtConfig, refreshJwtConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    UserModule,
    NotificationModule,
    SourceModule,
    TransactionModule,
    PlanModule,
    TicketModule,
    MethodModule,
    AdminModule,
    StatisticModule,
    SettingModule,
    ConfigModule,
    AuthModule,
    PlanInterestRateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
