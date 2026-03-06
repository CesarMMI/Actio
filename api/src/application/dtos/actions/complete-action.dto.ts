import { ActionDto } from './action.dto';

export type CompleteActionInput = {
  userId: string;
  actionId: string;
};

export type CompleteActionOutput = {
  action: ActionDto;
};
