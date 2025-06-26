import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AiChatMessagesDto } from 'src/ai-chat/dtos/ai-chat-message.dto';
import { AiChatDto } from 'src/ai-chat/dtos/ai-chat.dto';
import { AiChatService } from 'src/ai-chat/services/ai-chat.service';
import { UserJwtAuthGuard } from 'src/auth/guards/user.jwt-auth.guard';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get user information context',
    description: 'You should get it and prepend before sending chat message',
  })
  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [AiChatMessagesDto] })
  @Get()
  getChatSession(@Req() req: Request & { user: UserJwtRequest }) {
    return this.aiChatService.getUserContext(req.user.userId);
  }

  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'AI chat',
    description: 'Remember to get user context first',
  })
  @ApiBody({ type: AiChatDto })
  @ApiForbiddenResponse()
  @ApiOkResponse({ type: AiChatMessagesDto })
  @HttpCode(200)
  @Post()
  async ask(@Body() aiChatDto: AiChatDto) {
    return await this.aiChatService.ask(aiChatDto);
  }
}
