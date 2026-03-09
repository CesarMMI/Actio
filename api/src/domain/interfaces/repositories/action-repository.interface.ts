import { Action } from '../../entities/action.entity';
import { ActionQueryFiltersDto } from '../../dtos/action-query-filters.dto';

export const IActionRepository = Symbol('IActionRepository');

export interface IActionRepository {
  saveForUser(userId: string, action: Action): Promise<Action>;
  saveManyForUser(userId: string, actions: Action[]): Promise<Action[]>;
  findByIdForUser(userId: string, id: string): Promise<Action | null>;
  findOpenByContext(
    userId: string,
    contextId: string,
    filters?: ActionQueryFiltersDto,
  ): Promise<Action[]>;
  findByProject(userId: string, projectId: string): Promise<Action[]>;
}
