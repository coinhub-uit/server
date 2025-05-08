import {
  Body,
  Controller,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AiChatRequestDto } from 'src/ai-chat/dtos/ai-chat.request.dto';
import { AiChatResponseDto } from 'src/ai-chat/dtos/ai-chat.response.dto';
import { AiChatService } from 'src/ai-chat/services/ai-chat.service';
import { AiChatSession } from 'src/ai-chat/types/ai-chat-session.type';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'AI chat bot',
  })
  @ApiForbiddenResponse()
  @ApiOkResponse({ type: AiChatResponseDto })
  @HttpCode(200)
  @Post('chat')
  async ask(
    @Session()
    aiChatSession: AiChatSession,
    @Body()
    aiChatRequestDto: AiChatRequestDto & { user: UserJwtRequest },
  ) {
    return await this.aiChatService.ask({
      aiChatSession,
      aiChatRequestDto,
    });
  }
}
