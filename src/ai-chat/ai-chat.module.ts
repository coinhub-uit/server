import { Module } from '@nestjs/common';
import { AiChatController } from 'src/ai-chat/controllers/ai-chat.controller';
import { AiChatService } from 'src/ai-chat/services/ai-chat.service';

@Module({
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule {}
