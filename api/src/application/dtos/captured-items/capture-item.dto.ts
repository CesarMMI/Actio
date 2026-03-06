import { CapturedItemDto } from './captured-item.dto';

export type CaptureItemInput = {
  userId: string;
  title: string;
  notes?: string;
};

export type CaptureItemOutput = CapturedItemDto;
