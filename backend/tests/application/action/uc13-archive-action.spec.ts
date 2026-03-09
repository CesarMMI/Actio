import { ArchiveActionUseCase } from '../../../src/application/use-cases/action/archive-action.use-case';
import { ActionStatus } from '../../../src/domain/enums';
import { ActionNotFoundError } from '../../../src/application/errors';
import { ActionNotCompletedError } from '../../../src/domain/errors';
import { makeAction, mockActionRepo } from '../../helpers';

describe('UC-13 — Archive an Action', () => {
  it('transitions action from COMPLETED to ARCHIVED', async () => {
    const action = makeAction({ status: ActionStatus.COMPLETED });
    const repo = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const uc = new ArchiveActionUseCase(repo);

    await uc.execute('action-1');

    expect(action.status).toBe(ActionStatus.ARCHIVED);
    expect(repo.save).toHaveBeenCalledWith(action);
  });

  it('throws ActionNotFoundError when action does not exist', async () => {
    const repo = mockActionRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new ArchiveActionUseCase(repo).execute('missing'))
      .rejects.toThrow(ActionNotFoundError);
  });

  it('throws ActionNotCompletedError when action is OPEN', async () => {
    const action = makeAction({ status: ActionStatus.OPEN });
    const repo = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    await expect(new ArchiveActionUseCase(repo).execute('action-1'))
      .rejects.toThrow(ActionNotCompletedError);
  });
});
