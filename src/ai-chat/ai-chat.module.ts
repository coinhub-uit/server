import { Module } from '@nestjs/common';
import { AiChatController } from 'src/ai-chat/controllers/ai-chat.controller';
import { AiChatService } from 'src/ai-chat/services/ai-chat.service';
import { PlanModule } from 'src/plan/plan.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, PlanModule],
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule {}
