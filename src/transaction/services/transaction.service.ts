import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VnpayService } from 'nestjs-vnpay';
import { SourceEntity } from 'src/source/entities/source.entity';
import {
  CreateVnPayParams,
  TranferMoneysParams,
} from 'src/transaction/utils/types';
import { Repository } from 'typeorm';
import { dateFormat, ProductCode, VnpLocale } from 'vnpay';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
    private readonly vnpayService: VnpayService,
  ) {}

  getBankList() {
    return this.vnpayService.getBankList();
  }

  async tranferMoney(tranferMoneyDetails: TranferMoneysParams) {
    const [fromSource, toSource] = [
      await this.sourceRepository.findOneOrFail({
        where: { id: tranferMoneyDetails.fromSourceId },
      }),
      await this.sourceRepository.findOneOrFail({
        where: { id: tranferMoneyDetails.toSourceId },
      }),
    ];
    if (!fromSource || !toSource) {
      return 'Error';
    }
    fromSource.changeMoney(tranferMoneyDetails.money);
    toSource.changeMoney(tranferMoneyDetails.money);
    return 'Successful';
  }

  createVNPayPayment(paymentDetails: CreateVnPayParams) {
    return this.vnpayService.buildPaymentUrl({
      ...paymentDetails,
      vnp_OrderType: ProductCode.Pay,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date()),
    });
  }
}
