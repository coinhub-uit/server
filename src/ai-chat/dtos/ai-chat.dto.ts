import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { AiChatMessagesDto } from 'src/ai-chat/dtos/ai-chat-message.dto';

@ApiSchema()
export class AiChatDto {
  @ApiProperty({ isArray: true })
  messages!: AiChatMessagesDto[];
}
