import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { VnpayModule } from 'nestjs-vnpay';
import vnpayConfig from 'src/config/vnpay.config';
import { SourceEntity } from 'src/source/entities/source.entity';

@Module({
  imports: [
    VnpayModule.registerAsync(vnpayConfig.asProvider()),
    TypeOrmModule.forFeature([TransactionEntity, SourceEntity]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
