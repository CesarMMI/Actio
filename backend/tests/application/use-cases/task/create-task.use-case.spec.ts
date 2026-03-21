import { CreateTaskUseCase } from '../../../../src/application/use-cases/task/create-task.use-case';
import { ContextNotFoundError } from '../../../../src/domain/errors/context/context-not-found.error';
import { InvalidTaskDescriptionError } from '../../../../src/domain/errors/task/invalid-task-description.error';
import { ProjectNotFoundError } from '../../../../src/domain/errors/project/project-not-found.error';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';
import { Context } from '../../../../src/domain/entities/context/context.entity';
import { Project } from '../../../../src/domain/entities/project/project.entity';

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

  it('creates a task with valid description', async () => {
    const result = await useCase.execute({ description: 'Buy milk' });
    expect(result.description).toBe('Buy milk');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.contextId).toBeUndefined();
    expect(result.projectId).toBeUndefined();
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
});
