import { CreateTaskUseCase } from '../../../../src/application/use-cases/task/create-task.use-case';
import { ContextNotFoundError } from '../../../../src/domain/errors/context-not-found.error';
import { InvalidTaskDescriptionError } from '../../../../src/domain/errors/invalid-task-description.error';
import { ProjectNotFoundError } from '../../../../src/domain/errors/project-not-found.error';
import { TaskAlreadyHasChildError } from '../../../../src/domain/errors/task-already-has-child.error';
import { TaskNotFoundError } from '../../../../src/domain/errors/task-not-found.error';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';
import { Context } from '../../../../src/domain/entities/context.entity';
import { Project } from '../../../../src/domain/entities/project.entity';
import { Task } from '../../../../src/domain/entities/task.entity';

describe('UC-T01 — Create Task', () => {
  let useCase: CreateTaskUseCase;
  let taskRepo: InMemoryTaskRepository;
  let contextRepo: InMemoryContextRepository;
  let projectRepo: InMemoryProjectRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    contextRepo = new InMemoryContextRepository();
    projectRepo = new InMemoryProjectRepository();
    useCase = new CreateTaskUseCase(taskRepo, contextRepo, projectRepo);
  });

  it('creates a standalone task with valid description', async () => {
    const result = await useCase.execute({ description: 'Buy milk' });
    expect(result.description).toBe('Buy milk');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.contextId).toBeUndefined();
    expect(result.projectId).toBeUndefined();
    expect(result.parentTaskId).toBeUndefined();
  });

  it('rejects empty description', async () => {
    await expect(useCase.execute({ description: '   ' })).rejects.toThrow(InvalidTaskDescriptionError);
  });

  it('creates a task associated with an existing context', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Home' }));
    const result = await useCase.execute({ description: 'Fix sink', contextId: context.id });
    expect(result.contextId).toBe(context.id);
  });

  it('rejects when contextId references non-existent context', async () => {
    await expect(useCase.execute({ description: 'Fix sink', contextId: 'non-existent' })).rejects.toThrow(ContextNotFoundError);
  });

  it('creates a task associated with an existing project', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Home Reno' }));
    const result = await useCase.execute({ description: 'Buy tiles', projectId: project.id });
    expect(result.projectId).toBe(project.id);
  });

  it('rejects when projectId references non-existent project', async () => {
    await expect(useCase.execute({ description: 'Buy tiles', projectId: 'non-existent' })).rejects.toThrow(ProjectNotFoundError);
  });

  it('creates a child task and updates parent childTaskId', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent task' }));
    const child = await useCase.execute({ description: 'Child task', parentTaskId: parent.id });

    expect(child.parentTaskId).toBe(parent.id);
    const updatedParent = await taskRepo.findById(parent.id);
    expect(updatedParent?.childTaskId).toBe(child.id);
  });

  it('rejects when parentTaskId references non-existent task', async () => {
    await expect(useCase.execute({ description: 'Child task', parentTaskId: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });

  it('rejects when parent already has a child', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent' }));
    await useCase.execute({ description: 'First child', parentTaskId: parent.id });
    await expect(useCase.execute({ description: 'Second child', parentTaskId: parent.id })).rejects.toThrow(TaskAlreadyHasChildError);
  });
});
