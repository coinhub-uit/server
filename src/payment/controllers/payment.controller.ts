import { Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { TranferMoneyDto } from 'src/payment/dtos/transfer-money.dto';
import { TransferFromSourceNotExistsException } from 'src/payment/exceptions/transfer-from-source-not-exist.exception';
import { TransferToSourceNotExistsException } from 'src/payment/exceptions/transfer-to-source-not-exist.exception';
import { PaymentService } from 'src/payment/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Transfer moneys from source to source',
  })
  @ApiNotFoundResponse({
    description: 'Either from source or to source or both do not exist',
  })
  @Post('tranfer-money')
  async tranferMoney(tranferMoneyDto: TranferMoneyDto) {
    try {
      const ticketEntity =
        await this.paymentService.tranferMoney(tranferMoneyDto);
      return ticketEntity;
    } catch (error) {
      if (
        error instanceof TransferFromSourceNotExistsException ||
        error instanceof TransferToSourceNotExistsException
      ) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
