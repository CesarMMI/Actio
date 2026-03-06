import { ContextDto } from './context.dto';

export type RenameContextInput = {
  userId: string;
  contextId: string;
  name: string;
};

export type RenameContextOutput = {
  context: ContextDto;
};
