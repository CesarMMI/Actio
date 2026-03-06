import { ContextDto } from './context.dto';

export type CreateContextInput = {
  userId: string;
  name: string;
  description?: string;
};

export type CreateContextOutput = {
  context: ContextDto;
};
