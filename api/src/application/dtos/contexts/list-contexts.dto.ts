import { ContextDto } from './context.dto';

export type ListContextsInput = {
  userId: string;
};

export type ListContextsOutput = {
  contexts: ContextDto[];
};
