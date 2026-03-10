export interface CreateTaskInput {
  description: string;
  contextId?: string;
  projectId?: string;
  parentTaskId?: string;
}
