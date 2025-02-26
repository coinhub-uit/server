import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/mobile/auth/auth.module';
import { NotificationModule } from 'src/modules/mobile/notification/notification.module';
import { TicketModule } from 'src/modules/mobile/ticket/ticket.module';
import { TransactionModule } from 'src/modules/mobile/transaction/transaction.module';
import { UserModule } from 'src/modules/mobile/user/user.module';

@Module({
  imports: [
    TransactionModule,
    NotificationModule,
    TicketModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class MobileModule {}
