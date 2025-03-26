import { Injectable } from '@nestjs/common';
import { SourceService } from 'src/source/services/source.service';
import { TranferMoneysDto } from '../dtos/transfer-money.dto';
@Injectable()
export class PaymentService {
  constructor(private readonly sourceService: SourceService) {}

  async tranferMoney(tranferMoneyDetails: TranferMoneysDto) {
    await this.sourceService.changeBalanceSource(
      -tranferMoneyDetails.money,
      tranferMoneyDetails.fromSourceId,
    );
    await this.sourceService.changeBalanceSource(
      +tranferMoneyDetails.money,
      tranferMoneyDetails.toSourceId,
    );
    return 'Successful';
  }
}
