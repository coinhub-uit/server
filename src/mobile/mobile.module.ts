import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { TicketModule } from './ticket/ticket.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [
    AuthModule,
    NotificationModule,
    TicketModule,
    TransactionModule,
    UserModule,
    GuardModule,
  ],
  controllers: [],
  providers: [],
})
export class MobileModule {}
