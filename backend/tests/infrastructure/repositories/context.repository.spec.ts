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

  describe('findWithQuery', () => {
    it('returns all contexts with default pagination', async () => {
      await repo.save(Context.create({ title: 'Work' }));
      await repo.save(Context.create({ title: 'Home' }));

      const result = await repo.findWithQuery({});
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('paginates results', async () => {
      for (let i = 1; i <= 5; i++) {
        await repo.save(Context.create({ title: `Context ${i}` }));
      }

      const page1 = await repo.findWithQuery({ page: 1, limit: 2 });
      expect(page1.items).toHaveLength(2);
      expect(page1.total).toBe(5);

      const page3 = await repo.findWithQuery({ page: 3, limit: 2 });
      expect(page3.items).toHaveLength(1);
    });

    it('sorts by title asc', async () => {
      await repo.save(Context.create({ title: 'Zeta' }));
      await repo.save(Context.create({ title: 'Alpha' }));

      const result = await repo.findWithQuery({ sortBy: 'title', order: 'asc' });
      expect(result.items[0].title).toBe('Alpha');
      expect(result.items[1].title).toBe('Zeta');
    });

    it('sorts by title desc', async () => {
      await repo.save(Context.create({ title: 'Alpha' }));
      await repo.save(Context.create({ title: 'Zeta' }));

      const result = await repo.findWithQuery({ sortBy: 'title', order: 'desc' });
      expect(result.items[0].title).toBe('Zeta');
    });
  });
});
