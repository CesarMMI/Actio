import { GetContextUseCase } from '../../../../src/application/use-cases/context/get-context.use-case';
import { ContextNotFoundError } from '../../../../src/domain/errors/context-not-found.error';
import { Context } from '../../../../src/domain/entities/context.entity';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';

describe('UC-C02 — Get Context', () => {
  let useCase: GetContextUseCase;
  let contextRepo: InMemoryContextRepository;

  beforeEach(() => {
    contextRepo = new InMemoryContextRepository();
    useCase = new GetContextUseCase(contextRepo);
  });

  it('returns the context when it exists', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Work' }));
    const result = await useCase.execute({ id: context.id });
    expect(result.id).toBe(context.id);
    expect(result.title).toBe('Work');
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(ContextNotFoundError);
  });
});
