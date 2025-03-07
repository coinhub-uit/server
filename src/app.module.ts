import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { SourceModule } from 'src/user/source/source.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/user/source/entities/source.entity';
import { TransactionModule } from './transaction/transaction.module';
import { PlanModule } from './plan/plan.module';
import { TicketModule } from './ticket/ticket.module';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { MethodModule } from './method/method.module';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { MethodEntity } from 'src/method/entities/method.entity';
import { TicketInterestRateEntity } from 'src/ticket/ticket_interest_rate/entities/ticket_interest_rate.entity';
import { InterestRateEntity } from 'src/plan/interest_rate/entities/interest_rate.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        InterestRateEntity,
        TransactionEntity,
        UserEntity,
        NotificationEntity,
        SourceEntity,
        TicketEntity,
        MethodEntity,
        TicketInterestRateEntity,
      ],
      synchronize: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: () => ({
    //     type: 'postgres',
    //     host: process.env.DB_HOST,
    //     port: parseInt(process.env.DB_PORT ?? '5432', 10),
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_NAME,
    //     entities: [UserEntity, NotificationEntity, SourceEntity],
    //     synchronize: false,
    //   }),
    // }),
    UserModule,
    NotificationModule,
    SourceModule,
    TransactionModule,
    PlanModule,
    TicketModule,
    MethodModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
