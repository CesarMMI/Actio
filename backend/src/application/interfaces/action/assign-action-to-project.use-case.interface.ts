export interface AssignActionToProjectInput {
  actionId: string;
  projectId: string | null;
}

export interface IAssignActionToProjectUseCase {
  execute(input: AssignActionToProjectInput): Promise<void>;
}
