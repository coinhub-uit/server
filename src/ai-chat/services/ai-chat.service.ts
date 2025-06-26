import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { AiChatDto } from 'src/ai-chat/dtos/ai-chat.dto';
import { AiChatMessagesDto } from 'src/ai-chat/dtos/ai-chat-message.dto';
import { AvailablePlanView } from 'src/plan/entities/available-plan.entity';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';
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

  private readonly systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam =
    {
      role: 'system',
      content: `
You are a secure and knowledgeable banking assistant.
  - Answer questions about savings accounts, balances, interest rates, and transactions.
  - You must **not** provide advice outside of banking-related topics.
  - If the user asks for personal details, only respond with the data provided in the initial context.
  - Be precise, concise, and avoid speculation.
  - You must not answer in markdown type, just raw string.
`,
    };

  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  private OPENAI_MODEL = process.env.OPENAI_MODEL;

  private async getUserInformation(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        sources: {
          tickets: {
            status: TicketStatusEnum.active,
          },
        },
      },
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
      },
    });

    const aiChatResponseDto = new AiChatMessagesDto();
    aiChatResponseDto.role = 'system';
    aiChatResponseDto.content = `
This is the information you need to know about this user (in json format). You will have to parse yourself the json. Here is the data:
${JSON.stringify(user)}
`;
    return aiChatResponseDto;
  }

  private async getAvailablePlan() {
    const aiChatResponseDto = new AiChatMessagesDto();
    aiChatResponseDto.role = 'system';
    aiChatResponseDto.content = `And below is the current available plan in JSON format, try to read from it:
${JSON.stringify(await this.availablePlanRepository.find())}
`;
    return aiChatResponseDto;
  }

  async getUserContext(userId: string) {
    return [
      await this.getUserInformation(userId),
      await this.getAvailablePlan(),
    ];
  }

  async ask(aiChatDto: AiChatDto) {
    console.log(JSON.stringify(aiChatDto));

    const chatCompletion = await this.openai.chat.completions.create({
      metadata: { topic: 'savings_account' },
      messages: [
        this.systemPrompt,
        ...(aiChatDto.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[]),
      ],
      model: this.OPENAI_MODEL,
    });

    const messageContent = chatCompletion.choices[0].message.content;

    const aiChatResponseDto = new AiChatMessagesDto();
    aiChatResponseDto.role = 'assistant';
    aiChatResponseDto.content = messageContent;
    return aiChatResponseDto;
  }
}
