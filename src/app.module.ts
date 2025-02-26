import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Method } from 'src/modules/users/entities/method.entity';
import { Notification } from 'src/modules/users/entities/notification.entity';
import { Rate } from 'src/modules/users/entities/rate.entity';
import { Ticket } from 'src/modules/users/entities/ticket.entity';
import { Transaction } from 'src/modules/users/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Method, Notification, Rate, Ticket, Transaction, User],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
