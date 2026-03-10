import { RemoveChildTaskLinkUseCase } from '../../../../src/application/use-cases/task/remove-child-task-link.use-case';
import { TaskHasNoChildError } from '../../../../src/domain/errors/task-has-no-child.error';
import { TaskNotFoundError } from '../../../../src/domain/errors/task-not-found.error';
import { Task } from '../../../../src/domain/entities/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T07 — Remove Child Task Link', () => {
  let useCase: RemoveChildTaskLinkUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new RemoveChildTaskLinkUseCase(taskRepo);
  });

  it('unlinks parent and child, returning both updated tasks', async () => {
    const parent = Task.create({ description: 'Parent' });
    const child = Task.create({ description: 'Child' });
    parent.assignChild(child.id);
    child.assignParent(parent.id);
    await taskRepo.save(parent);
    await taskRepo.save(child);

    const result = await useCase.execute({ parentId: parent.id });

    expect(result.parent.childTaskId).toBeUndefined();
    expect(result.child.parentTaskId).toBeUndefined();
  });

  it('throws TaskNotFoundError when parent does not exist', async () => {
    await expect(useCase.execute({ parentId: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });

  it('throws TaskHasNoChildError when parent has no child', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent' }));
    await expect(useCase.execute({ parentId: parent.id })).rejects.toThrow(TaskHasNoChildError);
  });
});
