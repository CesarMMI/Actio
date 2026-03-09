import { RenameContextUseCase } from '../../../src/application/use-cases/context/rename-context.use-case';
import { ContextNotFoundError } from '../../../src/application/errors';
import { makeContext, mockContextRepo } from '../../helpers';

describe('UC-19 — Rename a Context', () => {
  it('updates the context name', async () => {
    const context = makeContext();
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    const uc = new RenameContextUseCase(repo);

    await uc.execute({ contextId: 'ctx-1', name: '@home' });

    expect(context.name).toBe('@home');
    expect(repo.save).toHaveBeenCalledWith(context);
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new RenameContextUseCase(repo).execute({ contextId: 'missing', name: 'x' }))
      .rejects.toThrow(ContextNotFoundError);
  });
});
