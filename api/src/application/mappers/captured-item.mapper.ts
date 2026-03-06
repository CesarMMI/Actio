import { CapturedItem } from '../../domain/entities/captured-item.entity';
import { CapturedItemDto } from '../dtos/captured-items/captured-item.dto';

export function toCapturedItemDto(item: CapturedItem): CapturedItemDto {
  return {
    id: item.id,
    title: item.title.getValue(),
    notes: item.notes,
    status: item.getStatus(),
  };
}
