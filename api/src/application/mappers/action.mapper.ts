import { Action } from '../../domain/entities/action.entity';
import { ActionDto } from '../dtos/actions/action.dto';

export function toActionDto(action: Action): ActionDto {
  return {
    id: action.id,
    title: action.title.getValue(),
    notes: action['notes'],
    dueDate: action['dueDate'] ? action['dueDate'].toISOString() : null,
    timeBucket: action['timeBucket'] ? action['timeBucket'].getValue() : null,
    energyLevel: action['energyLevel'] ? action['energyLevel'].getValue() : null,
    projectId: action.getProjectId(),
    contextId: action.getContextId(),
    status: action.getStatus(),
  };
}
