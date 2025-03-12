import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

@Module({ imports: [TypeOrmModule.forFeature([TransactionEntity])] })
export class TransactionModule {}
