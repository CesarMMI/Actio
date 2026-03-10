import {
  CreateContextUseCase,
  GetContextUseCase,
  ListContextsUseCase,
  UpdateContextUseCase,
  DeleteContextUseCase,
  CreateProjectUseCase,
  GetProjectUseCase,
  ListProjectsUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  CreateTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  AssignChildTaskUseCase,
  RemoveChildTaskLinkUseCase,
} from '../../application';
import { Repositories } from './infrastructure';

export interface UseCases {
  createContext: CreateContextUseCase;
  getContext: GetContextUseCase;
  listContexts: ListContextsUseCase;
  updateContext: UpdateContextUseCase;
  deleteContext: DeleteContextUseCase;
  createProject: CreateProjectUseCase;
  getProject: GetProjectUseCase;
  listProjects: ListProjectsUseCase;
  updateProject: UpdateProjectUseCase;
  deleteProject: DeleteProjectUseCase;
  createTask: CreateTaskUseCase;
  getTask: GetTaskUseCase;
  listTasks: ListTasksUseCase;
  updateTask: UpdateTaskUseCase;
  deleteTask: DeleteTaskUseCase;
  assignChildTask: AssignChildTaskUseCase;
  removeChildTaskLink: RemoveChildTaskLinkUseCase;
}

export function buildUseCases(repos: Repositories): UseCases {
  const { contexts, projects, tasks } = repos;

  return {
    createContext: new CreateContextUseCase(contexts),
    getContext: new GetContextUseCase(contexts),
    listContexts: new ListContextsUseCase(contexts),
    updateContext: new UpdateContextUseCase(contexts),
    deleteContext: new DeleteContextUseCase(contexts, tasks),
    createProject: new CreateProjectUseCase(projects),
    getProject: new GetProjectUseCase(projects),
    listProjects: new ListProjectsUseCase(projects),
    updateProject: new UpdateProjectUseCase(projects),
    deleteProject: new DeleteProjectUseCase(projects, tasks),
    createTask: new CreateTaskUseCase(tasks, contexts, projects),
    getTask: new GetTaskUseCase(tasks),
    listTasks: new ListTasksUseCase(tasks),
    updateTask: new UpdateTaskUseCase(tasks, contexts, projects),
    deleteTask: new DeleteTaskUseCase(tasks),
    assignChildTask: new AssignChildTaskUseCase(tasks),
    removeChildTaskLink: new RemoveChildTaskLinkUseCase(tasks),
  };
}
