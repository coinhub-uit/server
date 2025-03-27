import { Injectable } from '@nestjs/common';
import { VnpayService as _VnpayService } from 'nestjs-vnpay';
import {
  dateFormat,
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError,
  ProductCode,
  ReturnQueryFromVNPay,
  VnpLocale,
} from 'vnpay';
import { SourceService } from 'src/source/services/source.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TopUpEntity } from 'src/payment/entities/top-up.entity';
import { Repository } from 'typeorm';
import { CreateTopUpDto } from 'src/payment/dtos/create-top-up.dto';
import { TopUpEnum } from 'src/payment/types/top-up.enum';

@Injectable()
export class TopUpService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly vnpayService: _VnpayService,
    @InjectRepository(TopUpEntity)
    private readonly topUpRepository: Repository<TopUpEntity>,
  ) {}

  getBankList() {
    return this.vnpayService.getBankList();
  }

  async verifyIpn(query: ReturnQueryFromVNPay) {
    const verification = await this.vnpayService.verifyIpnCall(query);
    if (!verification.isVerified) {
      return IpnFailChecksum;
    }
    if (!verification.isSuccess) {
      return IpnUnknownError;
    }
    const topUpEntity = await this.topUpRepository.findOne({
      where: { id: verification.vnp_TxnRef },
    });
    if (!topUpEntity) {
      return IpnOrderNotFound;
    }
    if (verification.vnp_Amount != topUpEntity.amount) {
      return IpnInvalidAmount;
    }
    await this.sourceService.changeBalanceSource(
      topUpEntity.amount,
      topUpEntity.sourceDestination,
    );
    topUpEntity.isPaid = true;
    await this.topUpRepository.save(topUpEntity);
    return IpnSuccess;
  }

  async createVNPayPayment(paymentDetails: CreateTopUpDto) {
    await this.sourceService.getSourceById(paymentDetails.sourceDestination); // To check if exists, if not will raiase error

    const now = new Date();
    const topUpEntity = this.topUpRepository.create({
      type: TopUpEnum.VNPAY,
      amount: paymentDetails.amount,
      sourceDestination: paymentDetails.sourceDestination,
      isPaid: false,
    });

    await this.topUpRepository.save(topUpEntity);

    return this.vnpayService.buildPaymentUrl({
      vnp_ReturnUrl: paymentDetails.returnUrl,
      vnp_Amount: paymentDetails.amount,
      vnp_IpAddr: paymentDetails.ipAddress,
      vnp_OrderInfo: `Top up ${paymentDetails.amount} VND`,
      vnp_TxnRef: topUpEntity.id,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now),
      vnp_ExpireDate: dateFormat(
        new Date(new Date(now).setMinutes(now.getMinutes() + 15)),
      ),
    });
  }
}
