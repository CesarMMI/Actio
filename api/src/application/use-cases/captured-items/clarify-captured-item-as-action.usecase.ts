import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IClarifyItemService } from '../../../domain/interfaces/services/clarify-item-service.interface';
import { ICapturedItemRepository } from '../../../domain/interfaces/repositories/captured-item-repository.interface';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IUnitOfWork } from '../../interfaces/unit-of-work.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import {
  ClarifyCapturedItemAsActionInput,
  ClarifyCapturedItemAsActionOutput,
} from '../../dtos/captured-items/clarify-as-action.dto';
import { toCapturedItemDto } from '../../mappers/captured-item.mapper';
import { toActionDto } from '../../mappers/action.mapper';

export class ClarifyCapturedItemAsActionUseCase {
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly items: ICapturedItemRepository,
    private readonly actions: IActionRepository,
    private readonly clarify: IClarifyItemService,
    private readonly ids: IIdGenerator,
  ) { }

  async execute(input: ClarifyCapturedItemAsActionInput): Promise<ClarifyCapturedItemAsActionOutput> {
    const item = await this.items.findByIdForUser(input.userId, input.capturedItemId);
    if (!item) throw new EntityNotFoundError('CapturedItem', input.capturedItemId);

    const { updatedItem, actions } = this.clarify.clarifyAsAction(item, {
      actionId: this.ids.newId(),
      projectId: input.projectId,
      contextId: input.contextId,
    });

    return await this.uow.runInTransaction(async () => {
      const savedItem = await this.items.saveForUser(input.userId, updatedItem);
      const savedActions = await this.actions.saveManyForUser(input.userId, actions);

      return {
        item: toCapturedItemDto(savedItem),
        actions: savedActions.map(toActionDto)
      };
    });
  }
}
