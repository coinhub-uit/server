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
import { configModuleOptions } from 'src/config/nestjs-config.config';
@Controller()
export class RootController {
  @Get()
  root(): string {
    return 'CoinHub :P';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
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
