import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { VnpayModule } from 'nestjs-vnpay';
import vnpayConfig from 'src/config/vnpay.config';
import { SourceService } from 'src/source/services/source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { VnpayController } from 'src/payment/controllers/vnpay.controller';
import { TopUpService } from 'src/payment/services/top-up.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TopUpEntity } from 'src/payment/entities/top-up.entity';

@Module({
  imports: [
    VnpayModule.registerAsync(vnpayConfig.asProvider()),
    TypeOrmModule.forFeature([SourceEntity, TopUpEntity, UserEntity]),
  ],
  controllers: [PaymentController, VnpayController],
  providers: [PaymentService, SourceService, TopUpService],
})
export class PaymentModule {}
