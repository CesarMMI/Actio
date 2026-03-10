import { ListContextsUseCase } from '../../../../src/application/use-cases/context/list-contexts.use-case';
import { Context } from '../../../../src/domain/entities/context.entity';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';

describe('UC-C03 — List Contexts', () => {
  let useCase: ListContextsUseCase;
  let contextRepo: InMemoryContextRepository;

  beforeEach(() => {
    contextRepo = new InMemoryContextRepository();
    useCase = new ListContextsUseCase(contextRepo);
  });

  it('returns empty array when no contexts exist', async () => {
    expect(await useCase.execute()).toEqual([]);
  });

  it('returns all contexts', async () => {
    await contextRepo.save(Context.create({ title: 'Home' }));
    await contextRepo.save(Context.create({ title: 'Work' }));
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });
});
