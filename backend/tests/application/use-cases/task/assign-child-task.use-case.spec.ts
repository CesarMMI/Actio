import { AssignChildTaskUseCase } from '../../../../src/application/use-cases/task/assign-child-task.use-case';
import { TaskAlreadyHasChildError } from '../../../../src/domain/errors/task-already-has-child.error';
import { TaskAlreadyHasParentError } from '../../../../src/domain/errors/task-already-has-parent.error';
import { TaskCircularReferenceError } from '../../../../src/domain/errors/task-circular-reference.error';
import { TaskNotFoundError } from '../../../../src/domain/errors/task-not-found.error';
import { TaskSelfReferenceError } from '../../../../src/domain/errors/task-self-reference.error';
import { Task } from '../../../../src/domain/entities/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T06 — Assign Child Task', () => {
  let useCase: AssignChildTaskUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new AssignChildTaskUseCase(taskRepo);
  });

  it('assigns a child to a parent and returns both updated tasks', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent' }));
    const child = await taskRepo.save(Task.create({ description: 'Child' }));

    const result = await useCase.execute({ parentId: parent.id, childId: child.id });

    expect(result.parent.childTaskId).toBe(child.id);
    expect(result.child.parentTaskId).toBe(parent.id);
  });

  it('throws TaskNotFoundError when parent does not exist', async () => {
    const child = await taskRepo.save(Task.create({ description: 'Child' }));
    await expect(useCase.execute({ parentId: 'non-existent', childId: child.id })).rejects.toThrow(TaskNotFoundError);
  });

  it('throws TaskNotFoundError when child does not exist', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent' }));
    await expect(useCase.execute({ parentId: parent.id, childId: 'non-existent' })).rejects.toThrow(TaskNotFoundError);
  });

  it('throws TaskSelfReferenceError when parentId equals childId', async () => {
    const task = await taskRepo.save(Task.create({ description: 'Task' }));
    await expect(useCase.execute({ parentId: task.id, childId: task.id })).rejects.toThrow(TaskSelfReferenceError);
  });

  it('throws TaskAlreadyHasChildError when parent already has a child', async () => {
    const parent = Task.create({ description: 'Parent' });
    const existing = Task.create({ description: 'Existing child' });
    parent.assignChild(existing.id);
    await taskRepo.save(parent);
    await taskRepo.save(existing);
    const newChild = await taskRepo.save(Task.create({ description: 'New child' }));

    await expect(useCase.execute({ parentId: parent.id, childId: newChild.id })).rejects.toThrow(TaskAlreadyHasChildError);
  });

  it('throws TaskAlreadyHasParentError when child already has a parent', async () => {
    const parent = await taskRepo.save(Task.create({ description: 'Parent' }));
    const existingParent = Task.create({ description: 'Existing parent' });
    const child = Task.create({ description: 'Child' });
    child.assignParent(existingParent.id);
    await taskRepo.save(existingParent);
    await taskRepo.save(child);

    await expect(useCase.execute({ parentId: parent.id, childId: child.id })).rejects.toThrow(TaskAlreadyHasParentError);
  });

  it('throws TaskCircularReferenceError when assignment would create a cycle', async () => {
    const taskA = await taskRepo.save(Task.create({ description: 'A' }));
    const taskB = Task.create({ description: 'B' });
    taskB.assignParent(taskA.id);
    taskA.assignChild(taskB.id);
    await taskRepo.save(taskA);
    await taskRepo.save(taskB);

    await expect(useCase.execute({ parentId: taskB.id, childId: taskA.id })).rejects.toThrow(TaskCircularReferenceError);
  });
});
