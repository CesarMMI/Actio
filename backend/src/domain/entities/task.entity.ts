import { v4 as uuid } from 'uuid';
import { InvalidTaskDescriptionError } from '../errors/invalid-task-description.error';
import { TaskAlreadyHasChildError } from '../errors/task-already-has-child.error';
import { TaskAlreadyHasParentError } from '../errors/task-already-has-parent.error';
import { TaskSelfReferenceError } from '../errors/task-self-reference.error';

export interface TaskProps {
  readonly id: string;
  description: string;
  contextId?: string;
  projectId?: string;
  parentTaskId?: string;
  childTaskId?: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

export class Task {
  readonly id: string;
  description: string;
  contextId?: string;
  projectId?: string;
  parentTaskId?: string;
  childTaskId?: string;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.description = props.description;
    this.contextId = props.contextId;
    this.projectId = props.projectId;
    this.parentTaskId = props.parentTaskId;
    this.childTaskId = props.childTaskId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: {
    description: string;
    contextId?: string;
    projectId?: string;
    parentTaskId?: string;
  }): Task {
    if (!input.description.trim()) throw new InvalidTaskDescriptionError();
    const now = new Date();
    return new Task({
      id: uuid(),
      description: input.description,
      contextId: input.contextId,
      projectId: input.projectId,
      parentTaskId: input.parentTaskId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: TaskProps): Task {
    return new Task(props);
  }

  updateDescription(description: string): void {
    if (!description.trim()) throw new InvalidTaskDescriptionError();
    this.description = description;
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

  assignChild(childTaskId: string): void {
    if (childTaskId === this.id) throw new TaskSelfReferenceError();
    if (this.childTaskId !== undefined) throw new TaskAlreadyHasChildError(this.id);
    this.childTaskId = childTaskId;
    this.updatedAt = new Date();
  }

  assignParent(parentTaskId: string): void {
    if (parentTaskId === this.id) throw new TaskSelfReferenceError();
    if (this.parentTaskId !== undefined) throw new TaskAlreadyHasParentError(this.id);
    this.parentTaskId = parentTaskId;
    this.updatedAt = new Date();
  }

  removeChild(): void {
    this.childTaskId = undefined;
    this.updatedAt = new Date();
  }

  removeParent(): void {
    this.parentTaskId = undefined;
    this.updatedAt = new Date();
  }
}
