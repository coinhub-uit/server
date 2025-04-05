import { Injectable, NotFoundException } from '@nestjs/common';
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
import { TopUpProviderEnum } from 'src/payment/types/top-up-provider.enum';
import Decimal from 'decimal.js';

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
    const topUp = await this.topUpRepository.findOne({
      where: { id: verification.vnp_TxnRef },
    });
    if (!topUp) {
      return IpnOrderNotFound;
    }
    if (!topUp.amount.eq(verification.vnp_Amount)) {
      return IpnInvalidAmount;
    }
    await this.sourceService.changeBalanceSource(
      topUp.amount,
      topUp.sourceDestinationId,
    );
    topUp.isPaid = true;
    await this.topUpRepository.save(topUp);
    return IpnSuccess;
  }

  async createVNPayPayment(paymentDetails: CreateTopUpDto) {
    const source = await this.sourceService.getSourceByIdOrFail(
      paymentDetails.sourceDestination,
    ); // To check if exists, if not will raiase error

    if (!source) {
      throw new NotFoundException('Source destination not found');
    }

    const now = new Date();
    const topUpEntity = this.topUpRepository.create({
      provider: TopUpProviderEnum.vnpay,
      amount: new Decimal(paymentDetails.amount),
      sourceDestinationId: paymentDetails.sourceDestination,
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
