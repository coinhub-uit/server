import { Session } from 'express-session';
import { ChatCompletionMessageParam } from 'openai/resources';

export type AiChatSession = {
  messages?: ChatCompletionMessageParam[];
} & Session;
