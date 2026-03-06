import { ActionDto } from './action.dto';

export type AssignActionToProjectInput = {
  userId: string;
  actionId: string;
  projectId: string | null;
};

export type AssignActionToProjectOutput = {
  action: ActionDto;
};
