import { GetTaskUseCase } from '../../../../src/application/use-cases/task/get-task.use-case';
import { TaskNotFoundError } from '../../../../src/domain/errors/task/task-not-found.error';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T02 — Get Task', () => {
  let useCase: GetTaskUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new GetTaskUseCase(taskRepo);
  });

  it('returns the task when it exists', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Do something' }));
    const result = await useCase.execute({ id: task.id });
    expect(result.id).toBe(task.id);
    expect(result.description).toBe('Do something');
  });

  it('throws TaskNotFoundError when task does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });
});
