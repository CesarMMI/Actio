export interface AssignActionToContextInput {
  actionId: string;
  contextId: string | null;
}

export interface IAssignActionToContextUseCase {
  execute(input: AssignActionToContextInput): Promise<void>;
}
