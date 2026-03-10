import { UpdateContextUseCase } from '../../../../src/application/use-cases/context/update-context.use-case';
import { ContextNotFoundError } from '../../../../src/domain/errors/context-not-found.error';
import { ContextTitleAlreadyExistsError } from '../../../../src/domain/errors/context-title-already-exists.error';
import { InvalidContextTitleError } from '../../../../src/domain/errors/invalid-context-title.error';
import { Context } from '../../../../src/domain/entities/context.entity';
import { InMemoryContextRepository } from '../../mocks/in-memory-context.repository';

describe('UC-C04 — Update Context', () => {
  let useCase: UpdateContextUseCase;
  let contextRepo: InMemoryContextRepository;

  beforeEach(() => {
    contextRepo = new InMemoryContextRepository();
    useCase = new UpdateContextUseCase(contextRepo);
  });

  it('renames a context with a unique title', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Old Title' }));
    const result = await useCase.execute({ id: context.id, title: 'New Title' });
    expect(result.title).toBe('New Title');
  });

  it('allows renaming to the same title (no-op)', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Home' }));
    const result = await useCase.execute({ id: context.id, title: 'Home' });
    expect(result.title).toBe('Home');
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent', title: 'Title' })).rejects.toThrow(ContextNotFoundError);
  });

  it('rejects empty title', async () => {
    const context = await contextRepo.save(Context.create({ title: 'Home' }));
    await expect(useCase.execute({ id: context.id, title: '' })).rejects.toThrow(InvalidContextTitleError);
  });

  it('rejects title already used by another context', async () => {
    await contextRepo.save(Context.create({ title: 'Work' }));
    const context = await contextRepo.save(Context.create({ title: 'Home' }));
    await expect(useCase.execute({ id: context.id, title: 'work' })).rejects.toThrow(ContextTitleAlreadyExistsError);
  });
});
