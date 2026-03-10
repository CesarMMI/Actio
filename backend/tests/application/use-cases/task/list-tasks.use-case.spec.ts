import { ListTasksUseCase } from '../../../../src/application/use-cases/task/list-tasks.use-case';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-T03 — List Tasks', () => {
  let useCase: ListTasksUseCase;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    useCase = new ListTasksUseCase(taskRepo);
  });

  it('returns paginated result with zero items when no tasks exist', async () => {
    const result = await useCase.execute({});
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('returns all tasks with pagination metadata', async () => {
    await taskRepo.save(Task.create({ description: 'Task A' }));
    await taskRepo.save(Task.create({ description: 'Task B' }));
    const result = await useCase.execute({});
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('filters by done=true', async () => {
    const t1 = Task.create({ description: 'Done task' });
    t1.complete();
    await taskRepo.save(t1);
    await taskRepo.save(Task.create({ description: 'Pending task' }));

    const result = await useCase.execute({ done: true });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBe('Done task');
    expect(result.total).toBe(1);
  });

  it('filters by done=false', async () => {
    const t1 = Task.create({ description: 'Done task' });
    t1.complete();
    await taskRepo.save(t1);
    await taskRepo.save(Task.create({ description: 'Pending task' }));

    const result = await useCase.execute({ done: false });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBe('Pending task');
  });

  it('filters by contextId', async () => {
    await taskRepo.save(Task.create({ description: 'In context', contextId: 'ctx-1' }));
    await taskRepo.save(Task.create({ description: 'No context' }));

    const result = await useCase.execute({ contextId: 'ctx-1' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBe('In context');
  });

  it('filters by projectId', async () => {
    await taskRepo.save(Task.create({ description: 'In project', projectId: 'proj-1' }));
    await taskRepo.save(Task.create({ description: 'No project' }));

    const result = await useCase.execute({ projectId: 'proj-1' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBe('In project');
  });

  it('paginates results', async () => {
    for (let i = 1; i <= 5; i++) {
      await taskRepo.save(Task.create({ description: `Task ${i}` }));
    }

    const page1 = await useCase.execute({ page: 1, limit: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.total).toBe(5);
    expect(page1.page).toBe(1);
    expect(page1.limit).toBe(2);

    const page2 = await useCase.execute({ page: 2, limit: 2 });
    expect(page2.items).toHaveLength(2);

    const page3 = await useCase.execute({ page: 3, limit: 2 });
    expect(page3.items).toHaveLength(1);
  });

  it('sorts by description asc', async () => {
    await taskRepo.save(Task.create({ description: 'Zebra' }));
    await taskRepo.save(Task.create({ description: 'Apple' }));
    await taskRepo.save(Task.create({ description: 'Mango' }));

    const result = await useCase.execute({ sortBy: 'description', order: 'asc' });
    expect(result.items[0].description).toBe('Apple');
    expect(result.items[1].description).toBe('Mango');
    expect(result.items[2].description).toBe('Zebra');
  });

  it('sorts by description desc', async () => {
    await taskRepo.save(Task.create({ description: 'Zebra' }));
    await taskRepo.save(Task.create({ description: 'Apple' }));

    const result = await useCase.execute({ sortBy: 'description', order: 'desc' });
    expect(result.items[0].description).toBe('Zebra');
    expect(result.items[1].description).toBe('Apple');
  });
});
