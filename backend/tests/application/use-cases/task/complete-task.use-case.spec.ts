import { CompleteTaskUseCase } from '../../../../src/application/use-cases/task/complete-task.use-case';
import { TaskAlreadyDoneError } from '../../../../src/domain/errors/task/task-already-done.error';
import { TaskNotFoundError } from '../../../../src/domain/errors/task/task-not-found.error';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T06 — Complete Task', () => {
  let useCase: CompleteTaskUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new CompleteTaskUseCase(taskRepo);
  });

  it('marks the task as done and sets doneAt', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Buy milk' }));
    const before = new Date();
    const result = await useCase.execute({ id: task.id });
    expect(result.done).toBe(true);
    expect(result.doneAt).toBeInstanceOf(Date);
    expect(result.doneAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('refreshes updatedAt', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Buy milk' }));
    const before = task.updatedAt;
    const result = await useCase.execute({ id: task.id });
    expect(result.updatedAt >= before).toBe(true);
  });

  it('throws TaskNotFoundError when task does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });

  it('throws TaskAlreadyDoneError when task is already done', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Buy milk' }));
    await useCase.execute({ id: task.id });
    await expect(useCase.execute({ id: task.id })).rejects.toThrow(TaskAlreadyDoneError);
  });
});
