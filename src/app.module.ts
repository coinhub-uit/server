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
import { SettingModule } from './setting/setting.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import databaseConfig from 'src/config/database.config';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import userJwtConfig from 'src/config/user.jwt.config';
import { RootController } from 'src/root/controllers/root.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        adminJwtConfig,
        adminRefreshJwtConfig,
        userJwtConfig,
      ],
      isGlobal: true,
    }),
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
