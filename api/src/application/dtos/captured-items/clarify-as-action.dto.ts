import { ActionDto } from '../actions/action.dto';
import { CapturedItemDto } from './captured-item.dto';

export type ClarifyCapturedItemAsActionInput = {
  userId: string;
  capturedItemId: string;
  projectId?: string;
  contextId?: string;
};

export type ClarifyCapturedItemAsActionOutput = {
  item: CapturedItemDto;
  actions: ActionDto[];
};
