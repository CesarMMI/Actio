import { CreateContextUseCase } from '../../../../src/application/use-cases/context/create-context.use-case';
import { ContextTitleAlreadyExistsError } from '../../../../src/domain/errors/context/context-title-already-exists.error';
import { InvalidContextTitleError } from '../../../../src/domain/errors/context/invalid-context-title.error';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';

describe('UC-C01 — Create Context', () => {
  let useCase: CreateContextUseCase;
  let contextRepo: InMemoryContextRepository;

  beforeEach(() => {
    contextRepo = new InMemoryContextRepository();
    useCase = new CreateContextUseCase(contextRepo);
  });

  it('creates a context with a valid title', async () => {
    const result = await useCase.execute({ title: 'Home' });
    expect(result.title).toBe('Home');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('rejects empty title', async () => {
    await expect(useCase.execute({ title: '   ' })).rejects.toThrow(InvalidContextTitleError);
  });

  it('rejects duplicate title (case-insensitive)', async () => {
    await useCase.execute({ title: 'Home' });
    await expect(useCase.execute({ title: 'home' })).rejects.toThrow(ContextTitleAlreadyExistsError);
  });
});
