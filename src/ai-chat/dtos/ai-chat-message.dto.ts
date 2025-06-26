import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ChatCompletionMessageParam } from 'openai/resources';

@ApiSchema()
export class AiChatMessagesDto {
  @ApiProperty({
    enum: [
      'system',
      'user',
      'assistant',
    ] as const satisfies ChatCompletionMessageParam['role'][],
    description:
      'System is system prompt, assistant is the AI asnwer, and user is from user',
  })
  role!: Exclude<
    ChatCompletionMessageParam['role'],
    'developer' | 'tool' | 'function'
  >;

  @ApiProperty({ type: String, nullable: true })
  content!: string | null;
}
