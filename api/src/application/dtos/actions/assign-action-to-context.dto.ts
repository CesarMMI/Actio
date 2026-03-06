import { ActionDto } from './action.dto';

export type AssignActionToContextInput = {
  userId: string;
  actionId: string;
  contextId: string | null;
};

export type AssignActionToContextOutput = {
  action: ActionDto;
};
