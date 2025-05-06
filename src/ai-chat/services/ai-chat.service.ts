import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AiChatRequestDto } from 'src/ai-chat/dtos/ai-chat.request.dto';
import { AiChatResponseDto } from 'src/ai-chat/dtos/ai-chat.response.dto';
import { AiChatSession } from 'src/ai-chat/types/ai-chat-session.type';

@Injectable()
export class AiChatService {
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
    aiChatRequestDto: AiChatRequestDto;
  }) {
    if (aiChatSession.messages) {
      aiChatSession.messages.push({
        role: 'user',
        content: aiChatRequestDto.message,
      });
    } else {
      aiChatSession.messages = [
        {
          role: 'system',
          content: 'Cool', // TODO: @NTGNguyen give it context of what user has, bla bla, how much, many, option, no asking irrelevant requestions
        },
      ];
    }
    const chatCompletion = await this.openai.chat.completions.create({
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
