import { ListTasksUseCase } from '../../../../src/application/use-cases/task/list-tasks.use-case';
import { Task } from '../../../../src/domain/entities/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T03 — List Tasks', () => {
  let useCase: ListTasksUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new ListTasksUseCase(taskRepo);
  });

  it('returns empty array when no tasks exist', async () => {
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('returns all tasks', async () => {
    await taskRepo.save(Task.create({ description: 'Task A' }));
    await taskRepo.save(Task.create({ description: 'Task B' }));
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });
});
