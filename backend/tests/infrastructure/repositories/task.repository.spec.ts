import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from '../../../src/domain/entities/task/task.entity';
import { TaskOrmEntity } from '../../../src/infrastructure/entities/task.orm-entity';
import { TypeOrmTaskRepository } from '../../../src/infrastructure/repositories/type-orm-task.repository';

let dataSource: DataSource;
let repo: TypeOrmTaskRepository;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'sqljs',
    entities: [TaskOrmEntity],
    synchronize: true,
    dropSchema: true,
  });
  await dataSource.initialize();
  repo = new TypeOrmTaskRepository(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  await dataSource.getRepository(TaskOrmEntity).clear();
});

describe('TypeOrmTaskRepository', () => {
  it('saves and retrieves a task by id', async () => {
    const task = Task.create({ description: 'Buy milk' });
    await repo.save(task);

    const found = await repo.findById(task.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(task.id);
    expect(found!.description).toBe('Buy milk');
  });

  it('returns null for unknown id', async () => {
    const found = await repo.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('findAll returns all saved tasks', async () => {
    await repo.save(Task.create({ description: 'Task A' }));
    await repo.save(Task.create({ description: 'Task B' }));

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  it('persists optional fields as null when undefined', async () => {
    const task = Task.create({ description: 'Simple task' });
    await repo.save(task);

    const found = await repo.findById(task.id);
    expect(found!.contextId).toBeUndefined();
    expect(found!.projectId).toBeUndefined();
  });

  it('persists contextId and projectId when set', async () => {
    const task = Task.create({
      description: 'Associated task',
      contextId: 'ctx-123',
      projectId: 'proj-456',
    });
    await repo.save(task);

    const found = await repo.findById(task.id);
    expect(found!.contextId).toBe('ctx-123');
    expect(found!.projectId).toBe('proj-456');
  });

  it('findByContextId returns tasks with matching contextId', async () => {
    const ctxId = 'ctx-abc';
    await repo.save(Task.create({ description: 'In context', contextId: ctxId }));
    await repo.save(Task.create({ description: 'No context' }));

    const result = await repo.findByContextId(ctxId);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('In context');
  });

  it('findByProjectId returns tasks with matching projectId', async () => {
    const projId = 'proj-xyz';
    await repo.save(Task.create({ description: 'In project', projectId: projId }));
    await repo.save(Task.create({ description: 'Standalone' }));

    const result = await repo.findByProjectId(projId);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('In project');
  });

  it('save updates an existing task', async () => {
    const task = Task.create({ description: 'Original' });
    await repo.save(task);

    task.updateDescription('Updated');
    await repo.save(task);

    const found = await repo.findById(task.id);
    expect(found!.description).toBe('Updated');
  });

  it('delete removes the task', async () => {
    const task = Task.create({ description: 'To delete' });
    await repo.save(task);

    await repo.delete(task.id);

    const found = await repo.findById(task.id);
    expect(found).toBeNull();
  });

  it('save returns the task', async () => {
    const task = Task.create({ description: 'Returned' });
    const result = await repo.save(task);
    expect(result.id).toBe(task.id);
    expect(result.description).toBe('Returned');
  });

  it('persists done as false by default', async () => {
    const task = Task.create({ description: 'Not done' });
    await repo.save(task);
    const found = await repo.findById(task.id);
    expect(found!.done).toBe(false);
    expect(found!.doneAt).toBeUndefined();
  });

  it('persists done and doneAt when completed', async () => {
    const task = Task.create({ description: 'Done task' });
    task.complete();
    await repo.save(task);
    const found = await repo.findById(task.id);
    expect(found!.done).toBe(true);
    expect(found!.doneAt).toBeInstanceOf(Date);
  });

  it('persists done false and no doneAt when reopened', async () => {
    const task = Task.create({ description: 'Reopened task' });
    task.complete();
    await repo.save(task);
    task.reopen();
    await repo.save(task);
    const found = await repo.findById(task.id);
    expect(found!.done).toBe(false);
    expect(found!.doneAt).toBeUndefined();
  });

  describe('findWithQuery', () => {
    it('returns all tasks with default pagination when no filters', async () => {
      await repo.save(Task.create({ description: 'Task A' }));
      await repo.save(Task.create({ description: 'Task B' }));

      const result = await repo.findWithQuery({});
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('filters by done=true', async () => {
      const done = Task.create({ description: 'Done' });
      done.complete();
      await repo.save(done);
      await repo.save(Task.create({ description: 'Pending' }));

      const result = await repo.findWithQuery({ done: true });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].description).toBe('Done');
      expect(result.total).toBe(1);
    });

    it('filters by done=false', async () => {
      const done = Task.create({ description: 'Done' });
      done.complete();
      await repo.save(done);
      await repo.save(Task.create({ description: 'Pending' }));

      const result = await repo.findWithQuery({ done: false });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].description).toBe('Pending');
    });

    it('filters by contextId', async () => {
      await repo.save(Task.create({ description: 'In context', contextId: 'ctx-1' }));
      await repo.save(Task.create({ description: 'No context' }));

      const result = await repo.findWithQuery({ contextId: 'ctx-1' });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('filters by projectId', async () => {
      await repo.save(Task.create({ description: 'In project', projectId: 'proj-1' }));
      await repo.save(Task.create({ description: 'No project' }));

      const result = await repo.findWithQuery({ projectId: 'proj-1' });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('paginates results', async () => {
      for (let i = 1; i <= 5; i++) {
        await repo.save(Task.create({ description: `Task ${i}` }));
      }

      const page1 = await repo.findWithQuery({ page: 1, limit: 2 });
      expect(page1.items).toHaveLength(2);
      expect(page1.total).toBe(5);

      const page3 = await repo.findWithQuery({ page: 3, limit: 2 });
      expect(page3.items).toHaveLength(1);
    });

    it('sorts by description asc', async () => {
      await repo.save(Task.create({ description: 'Zebra' }));
      await repo.save(Task.create({ description: 'Apple' }));

      const result = await repo.findWithQuery({ sortBy: 'description', order: 'asc' });
      expect(result.items[0].description).toBe('Apple');
      expect(result.items[1].description).toBe('Zebra');
    });

    it('sorts by description desc', async () => {
      await repo.save(Task.create({ description: 'Apple' }));
      await repo.save(Task.create({ description: 'Zebra' }));

      const result = await repo.findWithQuery({ sortBy: 'description', order: 'desc' });
      expect(result.items[0].description).toBe('Zebra');
    });
  });
});
