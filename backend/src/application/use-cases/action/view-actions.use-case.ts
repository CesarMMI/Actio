import { Action } from '../../../domain/entities/action';
import { IActionRepository, ActionFilters } from '../../../domain/interfaces';
import { IViewActionsUseCase } from '../../interfaces/action/view-actions.use-case.interface';

export class ViewActionsUseCase implements IViewActionsUseCase {
  constructor(private readonly actions: IActionRepository) {}

  async execute(filters: ActionFilters = {}): Promise<Action[]> {
    return this.actions.findByFilters(filters);
  }
}
