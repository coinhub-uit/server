import { Controller, Post } from '@nestjs/common';
import { TranferMoneysDto } from 'src/payment/dtos/transfer-money.dto';
import { PaymentService } from 'src/payment/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('tranfer-money')
  async tranferMoney(tranferMoneyDto: TranferMoneysDto) {
    await this.paymentService.tranferMoney(tranferMoneyDto);
  }
}
