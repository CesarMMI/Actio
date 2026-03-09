import { DeactivateContextUseCase } from '../../../src/application/use-cases/context/deactivate-context.use-case';
import { ContextNotFoundError } from '../../../src/application/errors';
import { ContextNotActiveError } from '../../../src/domain/errors';
import { makeContext, mockContextRepo } from '../../helpers';

describe('UC-20 — Deactivate a Context', () => {
  it('sets active to false', async () => {
    const context = makeContext({ active: true });
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    const uc = new DeactivateContextUseCase(repo);

    await uc.execute('ctx-1');

    expect(context.active).toBe(false);
    expect(repo.save).toHaveBeenCalledWith(context);
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new DeactivateContextUseCase(repo).execute('missing'))
      .rejects.toThrow(ContextNotFoundError);
  });

  it('throws ContextNotActiveError when already inactive', async () => {
    const context = makeContext({ active: false });
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    await expect(new DeactivateContextUseCase(repo).execute('ctx-1'))
      .rejects.toThrow(ContextNotActiveError);
  });
});
