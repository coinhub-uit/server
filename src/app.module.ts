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
        TransactionEntity,
        UserEntity,
        NotificationEntity,
        SourceEntity,
        TicketEntity,
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
