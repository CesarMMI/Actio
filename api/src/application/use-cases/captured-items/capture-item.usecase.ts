import { Title } from '../../../domain/value-objects/title.value-object';
import { CapturedItem } from '../../../domain/entities/captured-item.entity';
import { ICapturedItemRepository } from '../../../domain/interfaces/repositories/captured-item-repository.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import {
  CaptureItemInput,
  CaptureItemOutput,
} from '../../dtos/captured-items/capture-item.dto';
import { toCapturedItemDto } from '../../mappers/captured-item.mapper';

export class CaptureItemUseCase {
  constructor(
    private readonly repo: ICapturedItemRepository,
    private readonly ids: IIdGenerator,
  ) {}

  async execute(input: CaptureItemInput): Promise<CaptureItemOutput> {
    const item = CapturedItem.create({
      id: this.ids.newId(),
      title: Title.create(input.title),
      notes: input.notes,
    });

    const saved = await this.repo.saveForUser(input.userId, item);
    return toCapturedItemDto(saved);
  }
}
