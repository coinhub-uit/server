import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { SourceModule } from './source/source.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TransactionModule } from './transaction/transaction.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, NotificationEntity, SourceEntity],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
