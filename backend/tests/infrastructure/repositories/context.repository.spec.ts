import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Context } from '../../../src/domain/entities/context/context.entity';
import { ContextOrmEntity } from '../../../src/infrastructure/entities/context.orm-entity';
import { TypeOrmContextRepository } from '../../../src/infrastructure/repositories/type-orm-context.repository';

let dataSource: DataSource;
let repo: TypeOrmContextRepository;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'sqljs',
    entities: [ContextOrmEntity],
    synchronize: true,
    dropSchema: true,
  });
  await dataSource.initialize();
  repo = new TypeOrmContextRepository(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  await dataSource.getRepository(ContextOrmEntity).clear();
});

describe('TypeOrmContextRepository', () => {
  it('saves and retrieves a context by id', async () => {
    const ctx = Context.create({ title: 'At home' });
    await repo.save(ctx);

    const found = await repo.findById(ctx.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(ctx.id);
    expect(found!.title).toBe('At home');
  });

  it('returns null for unknown id', async () => {
    const found = await repo.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('findAll returns all saved contexts', async () => {
    await repo.save(Context.create({ title: 'Work' }));
    await repo.save(Context.create({ title: 'Home' }));

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  it('findByTitle is case-insensitive', async () => {
    await repo.save(Context.create({ title: 'Office' }));

    const found = await repo.findByTitle('office');
    expect(found).not.toBeNull();
    expect(found!.title).toBe('Office');

    const notFound = await repo.findByTitle('home');
    expect(notFound).toBeNull();
  });

  it('save updates an existing context', async () => {
    const ctx = Context.create({ title: 'Initial' });
    await repo.save(ctx);

    ctx.rename('Updated');
    await repo.save(ctx);

    const found = await repo.findById(ctx.id);
    expect(found!.title).toBe('Updated');
  });

  it('delete removes the context', async () => {
    const ctx = Context.create({ title: 'To delete' });
    await repo.save(ctx);

    await repo.delete(ctx.id);

    const found = await repo.findById(ctx.id);
    expect(found).toBeNull();
  });

  it('save returns the context', async () => {
    const ctx = Context.create({ title: 'Returned' });
    const result = await repo.save(ctx);
    expect(result.id).toBe(ctx.id);
    expect(result.title).toBe('Returned');
  });
});
