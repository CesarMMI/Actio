import { AssignActionToContextUseCase } from '../../../src/application/use-cases/action/assign-action-to-context.use-case';
import { ActionNotFoundError, ContextNotFoundError } from '../../../src/application/errors';
import { makeAction, makeContext, mockActionRepo, mockContextRepo } from '../../helpers';

describe('UC-11 — Assign Action to Context', () => {
  it('sets contextId on the action', async () => {
    const action = makeAction();
    const context = makeContext();
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const contexts = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    const uc = new AssignActionToContextUseCase(actions, contexts);

    await uc.execute({ actionId: 'action-1', contextId: 'ctx-1' });

    expect(action.contextId).toBe('ctx-1');
    expect(actions.save).toHaveBeenCalledWith(action);
  });

  it('clears contextId when null is passed', async () => {
    const action = makeAction({ contextId: 'ctx-1' });
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const uc = new AssignActionToContextUseCase(actions, mockContextRepo());

    await uc.execute({ actionId: 'action-1', contextId: null });

    expect(action.contextId).toBeUndefined();
  });

  it('throws ActionNotFoundError when action does not exist', async () => {
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new AssignActionToContextUseCase(actions, mockContextRepo());
    await expect(uc.execute({ actionId: 'missing', contextId: 'ctx-1' }))
      .rejects.toThrow(ActionNotFoundError);
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    const action = makeAction();
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const contexts = mockContextRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new AssignActionToContextUseCase(actions, contexts);
    await expect(uc.execute({ actionId: 'action-1', contextId: 'missing' }))
      .rejects.toThrow(ContextNotFoundError);
  });
});
