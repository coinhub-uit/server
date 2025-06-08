import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class AiChatResponseDto {
  @ApiProperty()
  role!: 'user' | 'system' | 'assistant'; // NOTE: Let user know the system prompt :)

  @ApiProperty({ type: String, nullable: true })
  message!: string | null;
}
