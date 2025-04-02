import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { VnpayModule } from 'nestjs-vnpay';
import vnpayConfig from 'src/config/vnpay.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VnpayController } from 'src/payment/controllers/vnpay.controller';
import { TopUpService } from 'src/payment/services/top-up.service';
import { TopUpEntity } from 'src/payment/entities/top-up.entity';
import { SourceModule } from 'src/source/source.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    VnpayModule.registerAsync(vnpayConfig.asProvider()),
    TypeOrmModule.forFeature([TopUpEntity]),
    SourceModule,
    UserModule,
  ],
  controllers: [PaymentController, VnpayController],
  providers: [PaymentService, TopUpService],
})
export class PaymentModule {}
