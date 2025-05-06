import { ChatCompletionMessageParam } from 'openai/resources';

export type AiChatSession = {
  messages?: ChatCompletionMessageParam[];
};
