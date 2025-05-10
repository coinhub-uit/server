import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { AiChatRequestDto } from 'src/ai-chat/dtos/ai-chat.request.dto';
import { AiChatResponseDto } from 'src/ai-chat/dtos/ai-chat.response.dto';
import { AiChatSession } from 'src/ai-chat/types/ai-chat-session.type';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotExistException } from 'src/user/exceptions/user-not-exist.exception';
import { Repository } from 'typeorm';

@Injectable()
export class AiChatService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  private OPENAI_MODEL = process.env.OPENAI_MODEL;

  private async getUserInformation(userId: string) {
    // FIXME: ngalusdfasdfjaskdfj fix this
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: {
        sources: {
          topUps: true,
          tickets: {
            ticketHistories: {
              planHistory: {
                plan: true,
              },
            },
          },
        },
        notifications: true,
      },
    });
    if (!user) {
      throw new UserNotExistException();
    }
    return user;
  }

  async ask({
    aiChatSession,
    aiChatRequestDto,
    userId,
  }: {
    aiChatSession: AiChatSession;
    aiChatRequestDto: AiChatRequestDto;
    userId: string;
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
          content: `
You are a secure and knowledgeable banking assistant.
  - Answer questions about savings accounts, balances, interest rates, and transactions.
  - You must **not** provide advice outside of banking-related topics.
  - If the user asks for personal details, only respond with the data provided in the initial context.
  - Be precise, concise, and avoid speculation.
`,
        },
        {
          role: 'assistant',
          content: `This is the information you need to know about this user (in json format). You have to parse yourself the json. Here is ${JSON.stringify(
            await this.getUserInformation(userId),
          )}`,
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
        role: 'assistant',
        content: messageContent,
      });
    }

    // TODO: Declare abstract response dto and pass as arg to constructor later
    const aiChatResponseDto = new AiChatResponseDto();
    aiChatResponseDto.message = messageContent;
    return aiChatResponseDto;
  }

  deleteSession(aiChatSession: AiChatSession) {
    aiChatSession.destroy(() => {});
  }
}
