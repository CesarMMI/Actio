import { ListContextsUseCase } from '../../../../src/application/use-cases/context/list-contexts.use-case';
import { Context } from '../../../../src/domain/entities/context/context.entity';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';

describe('UC-C03 — List Contexts', () => {
  let useCase: ListContextsUseCase;
  let contextRepo: InMemoryContextRepository;

  beforeEach(() => {
    contextRepo = new InMemoryContextRepository();
    useCase = new ListContextsUseCase(contextRepo);
  });

  it('returns paginated result with zero items when no contexts exist', async () => {
    const result = await useCase.execute({});
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('returns all contexts with pagination metadata', async () => {
    await contextRepo.save(Context.create({ title: 'Home' }));
    await contextRepo.save(Context.create({ title: 'Work' }));
    const result = await useCase.execute({});
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('paginates results', async () => {
    for (let i = 1; i <= 5; i++) {
      await contextRepo.save(Context.create({ title: `Context ${i}` }));
    }

    const page1 = await useCase.execute({ page: 1, limit: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.total).toBe(5);

    const page3 = await useCase.execute({ page: 3, limit: 2 });
    expect(page3.items).toHaveLength(1);
  });

  it('sorts by title asc', async () => {
    await contextRepo.save(Context.create({ title: 'Work' }));
    await contextRepo.save(Context.create({ title: 'Home' }));
    await contextRepo.save(Context.create({ title: 'Gym' }));

    const result = await useCase.execute({ sortBy: 'title', order: 'asc' });
    expect(result.items[0].title).toBe('Gym');
    expect(result.items[1].title).toBe('Home');
    expect(result.items[2].title).toBe('Work');
  });

  it('sorts by title desc', async () => {
    await contextRepo.save(Context.create({ title: 'Alpha' }));
    await contextRepo.save(Context.create({ title: 'Zeta' }));

    const result = await useCase.execute({ sortBy: 'title', order: 'desc' });
    expect(result.items[0].title).toBe('Zeta');
    expect(result.items[1].title).toBe('Alpha');
  });
});
