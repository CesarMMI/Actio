export interface UpdateTaskInput {
  id: string;
  description?: string;
  contextId?: string | null;
  projectId?: string | null;
}
