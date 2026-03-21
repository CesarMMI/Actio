import { Task } from "../../../domain/entities/task/task.entity";
import { ContextNotFoundError } from "../../../domain/errors/context/context-not-found.error";
import { ProjectNotFoundError } from "../../../domain/errors/project/project-not-found.error";
import { IContextRepository } from "../../../domain/interfaces/context-repository.interface";
import { IProjectRepository } from "../../../domain/interfaces/project-repository.interface";
import { ITaskRepository } from "../../../domain/interfaces/task-repository.interface";
import { ICreateTaskUseCase } from "../../interfaces/task/create-task.use-case.interface";
import type { CreateTaskInput } from "../../types/inputs/task/create-task.input";
import type { CreateTaskOutput } from "../../types/outputs/task/create-task.output";

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    private readonly tasks: ITaskRepository,
    private readonly contexts: IContextRepository,
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<CreateTaskOutput> {
    if (input.contextId != null) {
      const context = await this.contexts.findById(input.contextId);
      if (!context) throw new ContextNotFoundError(input.contextId);
    }

    if (input.projectId != null) {
      const project = await this.projects.findById(input.projectId);
      if (!project) throw new ProjectNotFoundError(input.projectId);
    }

    const task = Task.create(input);
    await this.tasks.save(task);

    return task;
  }
}
