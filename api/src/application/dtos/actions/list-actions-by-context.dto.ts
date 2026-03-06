import { ActionDto } from './action.dto';

export type ListActionsByContextInput = {
  userId: string;
  contextId: string;
  timeBucket?: string;
  energyLevel?: string;
  dueFrom?: string;
  dueTo?: string;
};

export type ListActionsByContextOutput = {
  actions: ActionDto[];
};
