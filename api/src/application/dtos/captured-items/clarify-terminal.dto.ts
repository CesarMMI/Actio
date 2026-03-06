import { CapturedItemDto } from './captured-item.dto';

export type ClarifyCapturedItemTerminalInput = {
  userId: string;
  capturedItemId: string;
};

export type ClarifyCapturedItemTerminalOutput = {
  item: CapturedItemDto;
};
