export interface Task {
  id: string;
  description: string;
  contextId: string | null;
  projectId: string | null;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
  updatedAt: string;
}
