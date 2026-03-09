import { ActivateContextUseCase } from '../../../src/application/use-cases/context/activate-context.use-case';
import { ContextNotFoundError } from '../../../src/application/errors';
import { ContextAlreadyActiveError } from '../../../src/domain/errors';
import { makeContext, mockContextRepo } from '../../helpers';

describe('UC-21 — Activate a Context', () => {
  it('sets active to true', async () => {
    const context = makeContext({ active: false });
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    const uc = new ActivateContextUseCase(repo);

    await uc.execute('ctx-1');

    expect(context.active).toBe(true);
    expect(repo.save).toHaveBeenCalledWith(context);
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new ActivateContextUseCase(repo).execute('missing'))
      .rejects.toThrow(ContextNotFoundError);
  });

  it('throws ContextAlreadyActiveError when already active', async () => {
    const context = makeContext({ active: true });
    const repo = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    await expect(new ActivateContextUseCase(repo).execute('ctx-1'))
      .rejects.toThrow(ContextAlreadyActiveError);
  });
});
