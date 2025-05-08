import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AiChatRequestDto } from 'src/ai-chat/dtos/ai-chat.request.dto';
import { AiChatResponseDto } from 'src/ai-chat/dtos/ai-chat.response.dto';
import { AiChatSession } from 'src/ai-chat/types/ai-chat-session.type';
import { UserJwtRequest } from 'src/auth/types/user.jwt-request';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AiChatService {
  constructor(private readonly userService: UserService) {}

  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  private OPENAI_MODEL = process.env.OPENAI_MODEL;

  async ask({
    aiChatSession,
    aiChatRequestDto,
  }: {
    aiChatSession: AiChatSession;
    aiChatRequestDto: AiChatRequestDto & { user: UserJwtRequest };
  }) {
    const current_user = this.userService.findAllUserInformation(
      aiChatRequestDto.user.userId,
    );
    if (aiChatSession.messages) {
      aiChatSession.messages.push({
        role: 'user',
        content: aiChatRequestDto.message,
      });
    } else {
      aiChatSession.messages = [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: `You are a helpful banking assistant. Answer questions about savings accounts, balances, interest rates, and related transactions. This is the information you need to know about this user:
              ${JSON.stringify(current_user)}`,
            },
          ],
        },
        {
          role: 'user',
          content: aiChatRequestDto.message,
        },
      ];
    }

    const chatCompletion = await this.openai.chat.completions.create({
      metadata: { topic: 'savings_account' },
      messages: aiChatSession.messages,
      model: this.OPENAI_MODEL,
    });

    const messageContent = chatCompletion.choices[0].message.content;
    if (messageContent) {
      aiChatSession.messages.push({
        role: 'user',
        content: messageContent,
      });
    }

    // TODO: Declare abstract response dto and pass as arg to constructor later
    const aiChatResponseDto = new AiChatResponseDto();
    aiChatResponseDto.message = messageContent;
    return aiChatResponseDto;
  }
}
