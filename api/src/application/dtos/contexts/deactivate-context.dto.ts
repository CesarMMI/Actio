import { ContextDto } from './context.dto';

export type DeactivateContextInput = {
  userId: string;
  contextId: string;
};

export type DeactivateContextOutput = {
  context: ContextDto;
};
