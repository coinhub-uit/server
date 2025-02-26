import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { MobileModule } from './modules/mobile/mobile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/modules/mobile/notification/entities/notification.entity';
import { Ticket } from 'src/modules/mobile/ticket/entities/ticket.entity';
import { Transaction } from 'src/modules/mobile/transaction/entities/transaction.entity';
import { User } from 'src/modules/mobile/user/entities/user.entity';

@Module({
  imports: [
    MobileModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Notification, Ticket, Transaction, User],
      synchronize: false,
      migrations: [__dirname + '/modules/mobile/database/migration/**/*/{.ts}'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
