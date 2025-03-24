import { Injectable } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';
import { SourceService } from 'src/source/services/source.service';
import { dateFormat, ProductCode, VnpLocale } from 'vnpay';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';
import { CreateVnPayDto } from '../dtos/create-vnpay.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly vnpayService: VnpayService,
  ) {}

  getBankList() {
    return this.vnpayService.getBankList();
  }

  async tranferMoney(tranferMoneyDetails: TranferMoneysDto) {
    await this.sourceService.changeBalanceSource(
      -tranferMoneyDetails.money,
      tranferMoneyDetails.fromSourceId,
    );
    await this.sourceService.changeBalanceSource(
      +tranferMoneyDetails.money,
      tranferMoneyDetails.toSourceId,
    );
    return 'Successfule';
  }

  createVNPayPayment(paymentDetails: CreateVnPayDto) {
    return this.vnpayService.buildPaymentUrl({
      ...paymentDetails,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date()),
    });
  }
}
