import { v4 as uuid } from "uuid";
import { InvalidTaskDescriptionError } from "../../errors/task/invalid-task-description.error";
import { TaskAlreadyDoneError } from "../../errors/task/task-already-done.error";
import { TaskNotDoneError } from "../../errors/task/task-not-done.error";
import { Entity } from "../entity/entity";
import { TaskProps } from "./task.props";

export class Task extends Entity {
  description: string;
  done: boolean;
  doneAt?: Date;
  contextId?: string;
  projectId?: string;

  private constructor(props: TaskProps) {
    super(props);
    this.description = props.description;
    this.done = props.done;
    this.doneAt = props.doneAt;
    this.contextId = props.contextId;
    this.projectId = props.projectId;
  }

  static create(input: {
    description: string;
    contextId?: string | null;
    projectId?: string | null;
  }): Task {
    if (!input.description.trim()) throw new InvalidTaskDescriptionError();
    const now = new Date();
    return new Task({
      id: uuid(),
      description: input.description,
      done: false,
      contextId: input.contextId ?? undefined,
      projectId: input.projectId ?? undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  static load(props: TaskProps): Task {
    return new Task(props);
  }

  updateDescription(description: string): void {
    if (!description.trim()) throw new InvalidTaskDescriptionError();
    this.description = description;
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.done) throw new TaskAlreadyDoneError(this.id);
    this.done = true;
    this.doneAt = new Date();
    this.updatedAt = new Date();
  }

  reopen(): void {
    if (!this.done) throw new TaskNotDoneError(this.id);
    this.done = false;
    this.doneAt = undefined;
    this.updatedAt = new Date();
  }

  assignContext(contextId: string | null): void {
    this.contextId = contextId ?? undefined;
    this.updatedAt = new Date();
  }

  assignProject(projectId: string | null): void {
    this.projectId = projectId ?? undefined;
    this.updatedAt = new Date();
  }
}
