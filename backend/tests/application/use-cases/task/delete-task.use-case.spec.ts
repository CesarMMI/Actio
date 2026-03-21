import { DeleteTaskUseCase } from '../../../../src/application/use-cases/task/delete-task.use-case';
import { TaskNotFoundError } from '../../../../src/domain/errors/task/task-not-found.error';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T05 — Delete Task', () => {
  let useCase: DeleteTaskUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new DeleteTaskUseCase(taskRepo);
  });

  it('deletes an existing task', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    await useCase.execute({ id: task.id });
    expect(await taskRepo.findById(task.id)).toBeNull();
  });

  it('throws TaskNotFoundError for unknown id', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });
});
