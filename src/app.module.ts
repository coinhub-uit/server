import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plan/plan.module';
import { TicketModule } from './ticket/ticket.module';
import { MethodModule } from './method/method.module';
import { AdminModule } from './admin/admin.module';
import { StatisticModule } from './statistic/statistic.module';
import { SettingModule } from './setting/settings.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import databaseConfig from 'src/config/database.config';
import { Controller, Get } from '@nestjs/common';
import configOptions from 'src/config/config.module-options';
@Controller()
export class RootController {
  @Get()
  root(): string {
    return 'Made by NTNGuyen and KevinNitro';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(configOptions()),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    UserModule,
    NotificationModule,
    PaymentModule,
    PlanModule,
    TicketModule,
    MethodModule,
    AdminModule,
    StatisticModule,
    SettingModule,
    ConfigModule,
    AuthModule,
  ],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
