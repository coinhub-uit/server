import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class AiChatResponseDto {
  @ApiProperty()
  message!: string | null;
}
