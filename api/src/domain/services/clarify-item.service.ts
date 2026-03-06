import { Action } from '../entities/action.entity';
import { CapturedItem } from '../entities/captured-item.entity';
import { ClarifyAsActionResult, ClarifyAsProjectResult, IClarifyItemService } from '../interfaces/clarify-item-service.interface';
import { Project } from '../entities/project.entity';
import { Title } from '../value-objects/title.value-object';

export class ClarifyItemService implements IClarifyItemService {
  clarifyAsAction(item: CapturedItem, options: { actionId: string; projectId?: string; contextId?: string }): ClarifyAsActionResult {
    item.clarifyAsAction();

    const action = Action.create({
      id: options.actionId,
      title: item['title'] as Title,
      projectId: options.projectId ?? null,
      contextId: options.contextId ?? null,
    });

    return { updatedItem: item, actions: [action] };
  }

  clarifyAsProject(item: CapturedItem, options: { projectId: string; projectNameOverride?: string; firstActionId?: string }): ClarifyAsProjectResult {
    item.clarifyAsProject();

    const actions: Action[] = [];
    const projectName = options.projectNameOverride ?? item.title.getValue();
    const project = Project.create({ id: options.projectId, name: projectName });

    if (options.firstActionId) {
      actions.push(
        Action.create({
          id: options.firstActionId,
          title: item['title'] as Title,
          projectId: project.id,
        }),
      );
    }

    return { updatedItem: item, project, actions };
  }
}

