import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { ICapturedItemRepository } from '../../../domain/interfaces/repositories/captured-item-repository.interface';
import {
  ClarifyCapturedItemTerminalInput,
  ClarifyCapturedItemTerminalOutput,
} from '../../dtos/captured-items/clarify-terminal.dto';
import { toCapturedItemDto } from '../../mappers/captured-item.mapper';

export class ClarifyCapturedItemAsReferenceUseCase {
  constructor(private readonly items: ICapturedItemRepository) { }

  async execute(input: ClarifyCapturedItemTerminalInput): Promise<ClarifyCapturedItemTerminalOutput> {
    const item = await this.items.findByIdForUser(input.userId, input.capturedItemId);
    if (!item) throw new EntityNotFoundError('CapturedItem', input.capturedItemId);

    item.clarifyAsReference();
    const saved = await this.items.saveForUser(input.userId, item);

    return { item: toCapturedItemDto(saved) };
  }
}
