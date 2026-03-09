import { Inject, Injectable } from '@nestjs/common';
import { Title } from '../../../domain/value-objects/title.value-object';
import { CapturedItem } from '../../../domain/entities/captured-item.entity';
import { ICapturedItemRepository } from '../../../domain/interfaces/repositories/captured-item-repository.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import {
  CaptureItemInput,
  CaptureItemOutput,
} from '../../dtos/captured-items/capture-item.dto';
import { toCapturedItemDto } from '../../mappers/captured-item.mapper';
import { ICaptureItemUseCase } from '../../interfaces/use-cases/captured-items/capture-item.usecase.interface';

@Injectable()
export class CaptureItemUseCase implements ICaptureItemUseCase {
  constructor(
    @Inject(ICapturedItemRepository) private readonly repo: ICapturedItemRepository,
    @Inject(IIdGenerator) private readonly ids: IIdGenerator,
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
