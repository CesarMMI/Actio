import { DeleteContextUseCase } from '../../../../src/application/use-cases/context/delete-context.use-case';
import { ContextHasTasksError } from '../../../../src/domain/errors/context-has-tasks.error';
import { ContextNotFoundError } from '../../../../src/domain/errors/context-not-found.error';
import { Context } from '../../../../src/domain/entities/context.entity';
import { Task } from '../../../../src/domain/entities/task.entity';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-C05 — Delete Context', () => {
  let useCase: DeleteContextUseCase;
  let contextRepo: InMemoryContextRepository;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    contextRepo = new InMemoryContextRepository();
    taskRepo = new InMemoryTaskRepository();
    useCase = new DeleteContextUseCase(contextRepo, taskRepo);
  });

  it('deletes a context with no referencing tasks', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Home' }));
    await useCase.execute({ id: context.id });
    expect(await contextRepo.findById(context.id)).toBeNull();
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(ContextNotFoundError);
  });

  it('throws ContextHasTasksError when tasks reference this context', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Work' }));
    await taskRepo.save(Task.create({ description: 'Task', contextId: context.id }));
    await expect(useCase.execute({ id: context.id })).rejects.toThrow(ContextHasTasksError);
  });
});
