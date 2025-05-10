import * as dotenv from 'dotenv';
dotenv.config();

import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import { configModuleOptions } from 'src/config/nestjs-config.config';
import { ReportModule } from 'src/report/report.module';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PaymentModule } from 'src/payment/payment.module';
import { PlanModule } from 'src/plan/plan.module';
import { SettingModule } from 'src/setting/settings.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { UserModule } from 'src/user/user.module';
import { AiChatModule } from 'src/ai-chat/ai-chat.module';

@Controller()
export class RootController {
  @Get()
  root(): string {
    return 'CoinHub :P' + '\n' + `NTGNguyen & KevinNitro`;
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
    AdminModule,
    ReportModule,
    SettingModule,
    ConfigModule,
    AuthModule,
    AiChatModule,
  ],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
