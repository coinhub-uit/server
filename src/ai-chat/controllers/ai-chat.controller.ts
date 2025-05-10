import {
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  Session,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
  @ApiBody({ type: AiChatRequestDto })
  @ApiForbiddenResponse()
  @ApiOkResponse({ type: AiChatResponseDto })
  @HttpCode(200)
  @Post('chat')
  async ask(
    @Req()
    req: Request & {
      user: UserJwtRequest;
    } & {
      session: AiChatSession;
    } & {
      body: AiChatRequestDto;
    },
  ) {
    const { user, session: aiChatSession, body: aiChatRequestDto } = req;
    const userId = user.userId;
    return await this.aiChatService.ask({
      userId,
      aiChatRequestDto,
      aiChatSession,
    });
  }

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Delete chat session',
    description: 'When you are done, delete your butt',
  })
  @ApiForbiddenResponse()
  @Delete('session')
  deleteSession(@Session() aiChatSession: AiChatSession) {
    return this.aiChatService.deleteSession(aiChatSession);
  }
}
