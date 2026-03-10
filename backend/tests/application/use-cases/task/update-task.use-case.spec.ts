import { UpdateTaskUseCase } from '../../../../src/application/use-cases/task/update-task.use-case';
import { ContextNotFoundError } from '../../../../src/domain/errors/context/context-not-found.error';
import { InvalidTaskDescriptionError } from '../../../../src/domain/errors/task/invalid-task-description.error';
import { ProjectNotFoundError } from '../../../../src/domain/errors/project/project-not-found.error';
import { TaskNotFoundError } from '../../../../src/domain/errors/task/task-not-found.error';
import { Context } from '../../../../src/domain/entities/context/context.entity';
import { Project } from '../../../../src/domain/entities/project/project.entity';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T04 — Update Task', () => {
  let useCase: UpdateTaskUseCase;
  let taskRepo: InMemoryTaskRepository;
  let contextRepo: InMemoryContextRepository;
  let projectRepo: InMemoryProjectRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    contextRepo = new InMemoryContextRepository();
    projectRepo = new InMemoryProjectRepository();
    useCase = new UpdateTaskUseCase(taskRepo, contextRepo, projectRepo);
  });

  it('updates description', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Old desc' }));
    const result = await useCase.execute({ id: task.id, description: 'New desc' });
    expect(result.description).toBe('New desc');
  });

  it('rejects empty description', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Old desc' }));
    await expect(useCase.execute({ id: task.id, description: '  ' })).rejects.toThrow(InvalidTaskDescriptionError);
  });

  it('throws TaskNotFoundError for unknown id', async () => {
    await expect(useCase.execute({ id: 'non-existent', description: 'x' })).rejects.toThrow(TaskNotFoundError);
  });

  it('assigns context', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    const context = await contextRepo.save(Context.create({ title: 'Work' }));
    const result = await useCase.execute({ id: task.id, contextId: context.id });
    expect(result.contextId).toBe(context.id);
  });

  it('removes context when contextId is null', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Work' }));
    const task = await taskRepo.save(Task.create({ description: 'Task', contextId: context.id }));
    const result = await useCase.execute({ id: task.id, contextId: null });
    expect(result.contextId).toBeUndefined();
  });

  it('rejects when contextId references non-existent context', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    await expect(useCase.execute({ id: task.id, contextId: 'non-existent' })).rejects.toThrow(ContextNotFoundError);
  });

  it('assigns project', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    const result = await useCase.execute({ id: task.id, projectId: project.id });
    expect(result.projectId).toBe(project.id);
  });

  it('removes project when projectId is null', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    const task = await taskRepo.save(Task.create({ description: 'Task', projectId: project.id }));
    const result = await useCase.execute({ id: task.id, projectId: null });
    expect(result.projectId).toBeUndefined();
  });

  it('rejects when projectId references non-existent project', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    await expect(useCase.execute({ id: task.id, projectId: 'non-existent' })).rejects.toThrow(ProjectNotFoundError);
  });

  it('omitted fields are not changed', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Work' }));
    const task = await taskRepo.save(Task.create({ description: 'Task', contextId: context.id }));
    const result = await useCase.execute({ id: task.id, description: 'Updated' });
    expect(result.contextId).toBe(context.id);
  });
});
