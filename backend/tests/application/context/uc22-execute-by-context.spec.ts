import { ExecuteByContextUseCase } from '../../../src/application/use-cases/context/execute-by-context.use-case';
import { ActionStatus } from '../../../src/domain/enums';
import { ContextNotFoundError } from '../../../src/application/errors';
import { makeAction, makeContext, mockActionRepo, mockContextRepo } from '../../helpers';

describe('UC-22 — Execute by Context', () => {
  it('returns OPEN actions for the given context', async () => {
    const context = makeContext({ active: true });
    const action = makeAction({ contextId: 'ctx-1', status: ActionStatus.OPEN });
    const contexts = mockContextRepo({ findById: jest.fn().mockResolvedValue(context) });
    const actions = mockActionRepo({ findByFilters: jest.fn().mockResolvedValue([action]) });
    const uc = new ExecuteByContextUseCase(contexts, actions);

    const result = await uc.execute('ctx-1');

    expect(actions.findByFilters).toHaveBeenCalledWith({ contextId: 'ctx-1', status: ActionStatus.OPEN });
    expect(result).toEqual([action]);
  });

  it('throws ContextNotFoundError when context does not exist', async () => {
    const contexts = mockContextRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new ExecuteByContextUseCase(contexts, mockActionRepo());
    await expect(uc.execute('missing')).rejects.toThrow(ContextNotFoundError);
  });
});
