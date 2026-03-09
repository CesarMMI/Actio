import { ViewInboxUseCase } from '../../../src/application/use-cases/captured-item/view-inbox.use-case';
import { CapturedItemStatus } from '../../../src/domain/enums';
import { makeCapturedItem, mockCapturedItemRepo } from '../../helpers';

describe('UC-03 — View Inbox', () => {
  it('returns all items with INBOX status', async () => {
    const item = makeCapturedItem();
    const repo = mockCapturedItemRepo({ findByStatus: jest.fn().mockResolvedValue([item]) });
    const uc = new ViewInboxUseCase(repo);

    const result = await uc.execute();

    expect(repo.findByStatus).toHaveBeenCalledWith(CapturedItemStatus.INBOX);
    expect(result).toEqual([item]);
  });

  it('returns an empty list when inbox is empty', async () => {
    const repo = mockCapturedItemRepo({ findByStatus: jest.fn().mockResolvedValue([]) });
    const uc = new ViewInboxUseCase(repo);

    expect(await uc.execute()).toEqual([]);
  });
});
