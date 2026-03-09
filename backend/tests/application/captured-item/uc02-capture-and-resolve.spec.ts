import { CaptureAndResolveUseCase } from '../../../src/application/use-cases/captured-item/capture-and-resolve.use-case';
import { CapturedItemStatus, ActionStatus } from '../../../src/domain/enums';
import { mockCapturedItemRepo, mockActionRepo } from '../../helpers';

describe('UC-02 — Capture and Resolve Inline', () => {
  it('creates a CapturedItem with CLARIFIED_AS_ACTION and an Action with OPEN status', async () => {
    const capturedItems = mockCapturedItemRepo();
    const actions = mockActionRepo();
    const uc = new CaptureAndResolveUseCase(capturedItems, actions);

    const result = await uc.execute({ title: 'Idea', actionTitle: 'Draft outline' });

    expect(result.capturedItem.status).toBe(CapturedItemStatus.CLARIFIED_AS_ACTION);
    expect(result.action.status).toBe(ActionStatus.OPEN);
    expect(result.action.title).toBe('Draft outline');
    expect(capturedItems.save).toHaveBeenCalledWith(result.capturedItem);
    expect(actions.save).toHaveBeenCalledWith(result.action);
  });

  it('the captured item does not appear in INBOX (status is resolved)', async () => {
    const uc = new CaptureAndResolveUseCase(mockCapturedItemRepo(), mockActionRepo());
    const result = await uc.execute({ title: 'x', actionTitle: 'y' });
    expect(result.capturedItem.status).not.toBe(CapturedItemStatus.INBOX);
  });
});
