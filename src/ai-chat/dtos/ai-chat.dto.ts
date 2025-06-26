import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { AiChatMessagesDto } from 'src/ai-chat/dtos/ai-chat-message.dto';

@ApiSchema()
export class AiChatDto {
  @ApiProperty({
    isArray: true,
    type: AiChatMessagesDto,
  })
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => AiChatMessagesDto)
  messages!: AiChatMessagesDto[];
}
