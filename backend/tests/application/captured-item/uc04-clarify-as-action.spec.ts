import { ClarifyAsActionUseCase } from '../../../src/application/use-cases/captured-item/clarify-as-action.use-case';
import { CapturedItemStatus, ActionStatus } from '../../../src/domain/enums';
import { CapturedItemNotFoundError } from '../../../src/application/errors';
import { ItemAlreadyResolvedError } from '../../../src/domain/errors';
import { makeCapturedItem, mockCapturedItemRepo, mockActionRepo } from '../../helpers';

describe('UC-04 — Clarify as Action', () => {
  it('marks the item as CLARIFIED_AS_ACTION and creates an OPEN action', async () => {
    const item = makeCapturedItem();
    const capturedItems = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const actions = mockActionRepo();
    const uc = new ClarifyAsActionUseCase(capturedItems, actions);

    const action = await uc.execute({ capturedItemId: 'item-1', actionTitle: 'Do the thing' });

    expect(item.status).toBe(CapturedItemStatus.CLARIFIED_AS_ACTION);
    expect(action.title).toBe('Do the thing');
    expect(action.status).toBe(ActionStatus.OPEN);
    expect(capturedItems.save).toHaveBeenCalledWith(item);
    expect(actions.save).toHaveBeenCalledWith(action);
  });

  it('throws CapturedItemNotFoundError when item does not exist', async () => {
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new ClarifyAsActionUseCase(repo, mockActionRepo());

    await expect(uc.execute({ capturedItemId: 'missing', actionTitle: 'x' }))
      .rejects.toThrow(CapturedItemNotFoundError);
  });

  it('throws ItemAlreadyResolvedError when item is not INBOX', async () => {
    const item = makeCapturedItem({ status: CapturedItemStatus.SOMEDAY });
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const uc = new ClarifyAsActionUseCase(repo, mockActionRepo());

    await expect(uc.execute({ capturedItemId: 'item-1', actionTitle: 'x' }))
      .rejects.toThrow(ItemAlreadyResolvedError);
  });
});
