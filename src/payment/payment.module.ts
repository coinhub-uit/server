import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { VnpayModule } from 'nestjs-vnpay';
import vnpayConfig from 'src/config/vnpay.config';
import { SourceService } from 'src/source/services/source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { VnpayController } from 'src/payment/controllers/vnpay.controller';
import { VnpayService } from 'src/payment/services/vnpay.service';
import { TransactionEntity } from 'src/payment/entities/transaction.entity';

@Module({
  imports: [
    VnpayModule.registerAsync(vnpayConfig.asProvider()),
    TypeOrmModule.forFeature([SourceEntity, TransactionEntity]),
  ],
  controllers: [PaymentController, VnpayController],
  providers: [PaymentService, SourceService, VnpayService],
})
export class PaymentModule {}
