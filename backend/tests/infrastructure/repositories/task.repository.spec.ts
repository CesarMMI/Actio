import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from '../../../src/domain/entities/task.entity';
import { TaskOrmEntity } from '../../../src/infrastructure/entities/TaskOrmEntity';
import { TypeOrmTaskRepository } from '../../../src/infrastructure/repositories/TypeOrmTaskRepository';

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
    expect(found!.parentTaskId).toBeUndefined();
    expect(found!.childTaskId).toBeUndefined();
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
});
