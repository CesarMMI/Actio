import { CompleteActionUseCase } from '../../../src/application/use-cases/action/complete-action.use-case';
import { ActionStatus } from '../../../src/domain/enums';
import { ActionNotFoundError } from '../../../src/application/errors';
import { ActionNotOpenError } from '../../../src/domain/errors';
import { makeAction, mockActionRepo } from '../../helpers';

describe('UC-12 — Complete an Action', () => {
  it('transitions action from OPEN to COMPLETED', async () => {
    const action = makeAction({ status: ActionStatus.OPEN });
    const repo = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const uc = new CompleteActionUseCase(repo);

    await uc.execute('action-1');

    expect(action.status).toBe(ActionStatus.COMPLETED);
    expect(repo.save).toHaveBeenCalledWith(action);
  });

  it('throws ActionNotFoundError when action does not exist', async () => {
    const repo = mockActionRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new CompleteActionUseCase(repo).execute('missing'))
      .rejects.toThrow(ActionNotFoundError);
  });

  it('throws ActionNotOpenError when action is not OPEN', async () => {
    const action = makeAction({ status: ActionStatus.COMPLETED });
    const repo = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    await expect(new CompleteActionUseCase(repo).execute('action-1'))
      .rejects.toThrow(ActionNotOpenError);
  });
});
