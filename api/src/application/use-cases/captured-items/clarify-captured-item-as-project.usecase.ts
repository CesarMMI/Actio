import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IClarifyItemService } from '../../../domain/interfaces/services/clarify-item-service.interface';
import { ICapturedItemRepository } from '../../../domain/interfaces/repositories/captured-item-repository.interface';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import { IUnitOfWork } from '../../interfaces/unit-of-work.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import {
  ClarifyCapturedItemAsProjectInput,
  ClarifyCapturedItemAsProjectOutput,
} from '../../dtos/captured-items/clarify-as-project.dto';
import { toCapturedItemDto } from '../../mappers/captured-item.mapper';
import { toActionDto } from '../../mappers/action.mapper';
import { toProjectDto } from '../../mappers/project.mapper';

export class ClarifyCapturedItemAsProjectUseCase {
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly items: ICapturedItemRepository,
    private readonly projects: IProjectRepository,
    private readonly actions: IActionRepository,
    private readonly clarify: IClarifyItemService,
    private readonly ids: IIdGenerator,
  ) {}

  async execute(
    input: ClarifyCapturedItemAsProjectInput,
  ): Promise<ClarifyCapturedItemAsProjectOutput> {
    const item = await this.items.findByIdForUser(
      input.userId,
      input.capturedItemId,
    );
    if (!item)
      throw new EntityNotFoundError('CapturedItem', input.capturedItemId);

    const projectId = this.ids.newId();
    const firstActionId = input.createFirstAction
      ? this.ids.newId()
      : undefined;

    const { updatedItem, project, actions } = this.clarify.clarifyAsProject(
      item,
      {
        projectId,
        projectNameOverride: input.projectNameOverride,
        firstActionId,
      },
    );

    return await this.uow.runInTransaction(async () => {
      const savedItem = await this.items.saveForUser(input.userId, updatedItem);
      const savedProject = await this.projects.saveForUser(
        input.userId,
        project,
      );
      const savedActions = actions.length
        ? await this.actions.saveManyForUser(input.userId, actions)
        : [];
      return {
        item: toCapturedItemDto(savedItem),
        project: toProjectDto(savedProject),
        actions: savedActions.map(toActionDto),
      };
    });
  }
}
