import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class AiChatSessionResponseDto {
  @ApiProperty()
  role!: 'user' | 'system' | 'assistant'; // NOTE: Let user know the system prompt :)

  @ApiProperty()
  message!: string;
}
