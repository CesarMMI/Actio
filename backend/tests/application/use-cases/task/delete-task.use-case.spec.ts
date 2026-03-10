import { DeleteTaskUseCase } from '../../../../src/application/use-cases/task/delete-task.use-case';
import { TaskNotFoundError } from '../../../../src/domain/errors/task-not-found.error';
import { Task } from '../../../../src/domain/entities/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T05 — Delete Task', () => {
  let useCase: DeleteTaskUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new DeleteTaskUseCase(taskRepo);
  });

  it('deletes an existing standalone task', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    await useCase.execute({ id: task.id });
    expect(await taskRepo.findById(task.id)).toBeNull();
  });

  it('throws TaskNotFoundError for unknown id', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });

  it('clears child parentTaskId when deleting parent', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent' }));
    const child = Task.create({ description: 'Child' });
    child.assignParent(parent.id);
    parent.assignChild(child.id);
    await taskRepo.save(parent);
    await taskRepo.save(child);

    await useCase.execute({ id: parent.id });

    const updatedChild = await taskRepo.findById(child.id);
    expect(updatedChild?.parentTaskId).toBeUndefined();
    expect(await taskRepo.findById(parent.id)).toBeNull();
  });

  it('clears parent childTaskId when deleting child', async () => {
    const parent = Task.create({ description: 'Parent' });
    const child = Task.create({ description: 'Child' });
    child.assignParent(parent.id);
    parent.assignChild(child.id);
    await taskRepo.save(parent);
    await taskRepo.save(child);

    await useCase.execute({ id: child.id });

    const updatedParent = await taskRepo.findById(parent.id);
    expect(updatedParent?.childTaskId).toBeUndefined();
    expect(await taskRepo.findById(child.id)).toBeNull();
  });

  it('clears both parent and child links when deleting a middle node', async () => {
    const grandparent = Task.create({ description: 'Grandparent' });
    const middle = Task.create({ description: 'Middle' });
    const grandchild = Task.create({ description: 'Grandchild' });

    grandparent.assignChild(middle.id);
    middle.assignParent(grandparent.id);
    middle.assignChild(grandchild.id);
    grandchild.assignParent(middle.id);

    await taskRepo.save(grandparent);
    await taskRepo.save(middle);
    await taskRepo.save(grandchild);

    await useCase.execute({ id: middle.id });

    const updatedGrandparent = await taskRepo.findById(grandparent.id);
    const updatedGrandchild = await taskRepo.findById(grandchild.id);
    expect(updatedGrandparent?.childTaskId).toBeUndefined();
    expect(updatedGrandchild?.parentTaskId).toBeUndefined();
    expect(await taskRepo.findById(middle.id)).toBeNull();
  });
});
