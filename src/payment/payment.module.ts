import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { VnpayModule } from 'nestjs-vnpay';
import vnpayConfig from 'src/config/vnpay.config';
import { SourceService } from 'src/source/services/source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { VnpayTransactionEntity } from 'src/payment/entities/vnpay-transaction.entity';

@Module({
  imports: [
    VnpayModule.registerAsync(vnpayConfig.asProvider()),
    TypeOrmModule.forFeature([SourceEntity, VnpayTransactionEntity]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, SourceService],
})
export class PaymentModule {}
