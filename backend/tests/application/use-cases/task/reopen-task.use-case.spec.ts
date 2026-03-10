import { ReopenTaskUseCase } from '../../../../src/application/use-cases/task/reopen-task.use-case';
import { TaskNotDoneError } from '../../../../src/domain/errors/task/task-not-done.error';
import { TaskNotFoundError } from '../../../../src/domain/errors/task/task-not-found.error';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T07 — Reopen Task', () => {
  let useCase: ReopenTaskUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new ReopenTaskUseCase(taskRepo);
  });

  it('marks the task as not done and clears doneAt', async () => {
    const task = Task.create({ description: 'Buy milk' });
    task.complete();
    await taskRepo.save(task);

    const result = await useCase.execute({ id: task.id });
    expect(result.done).toBe(false);
    expect(result.doneAt).toBeUndefined();
  });

  it('refreshes updatedAt', async () => {
    const task = Task.create({ description: 'Buy milk' });
    task.complete();
    await taskRepo.save(task);
    const before = task.updatedAt;
    const result = await useCase.execute({ id: task.id });
    expect(result.updatedAt >= before).toBe(true);
  });

  it('throws TaskNotFoundError when task does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });

  it('throws TaskNotDoneError when task is not done', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Buy milk' }));
    await expect(useCase.execute({ id: task.id })).rejects.toThrow(TaskNotDoneError);
  });
});
