import { Action } from '../../../domain/entities/action';

export interface IExecuteByContextUseCase {
  execute(contextId: string): Promise<Action[]>;
}
