import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { AiChatRequestDto } from 'src/ai-chat/dtos/ai-chat.request.dto';
import { AiChatResponseDto } from 'src/ai-chat/dtos/ai-chat.response.dto';
import { AiChatSession } from 'src/ai-chat/types/ai-chat-session.type';
import { AvailablePlanView } from 'src/plan/entities/available-plan.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AiChatService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AvailablePlanView)
    private readonly availablePlanRepository: Repository<AvailablePlanView>,
  ) {}

  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  private OPENAI_MODEL = process.env.OPENAI_MODEL;

  private async getUserInformation(userId: string) {
    const user = await this.userRepository.findOne({
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
    return JSON.stringify(user);
  }

  getChatSession(aiChatSession: AiChatSession) {
    const messages = aiChatSession.messages?.slice(1);

    if (!messages) {
      return [];
    }
    const aiChatSessionResponseDto = messages.map((message) => {
      const aiChatSession = new AiChatResponseDto();
      aiChatSession.message = message.content as string; // I guess it will be mostly in string format//:
      aiChatSession.role = message.role;
      return aiChatSession;
    });
    return aiChatSessionResponseDto;
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
          role: 'system',
          content: `This is the information you need to know about this user (in json format). You will have to parse yourself the json. Here is the data:
${await this.getUserInformation(userId)}`,
        },
        {
          role: 'system',
          content: `And below is the current available plan in JSON format, try to read from it:
${JSON.stringify(await this.availablePlanRepository.find())}
`,
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
    aiChatResponseDto.role = 'assistant';
    aiChatResponseDto.message = messageContent;
    return aiChatResponseDto;
  }

  deleteSession(aiChatSession: AiChatSession) {
    aiChatSession.destroy(() => {});
  }
}
