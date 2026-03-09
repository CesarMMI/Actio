import { MoveToTrashUseCase } from '../../../src/application/use-cases/captured-item/move-to-trash.use-case';
import { CapturedItemStatus } from '../../../src/domain/enums';
import { CapturedItemNotFoundError } from '../../../src/application/errors';
import { ItemAlreadyResolvedError } from '../../../src/domain/errors';
import { makeCapturedItem, mockCapturedItemRepo } from '../../helpers';

describe('UC-08 — Move to Trash', () => {
  it('sets item status to TRASH', async () => {
    const item = makeCapturedItem();
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const uc = new MoveToTrashUseCase(repo);

    await uc.execute('item-1');

    expect(item.status).toBe(CapturedItemStatus.TRASH);
    expect(repo.save).toHaveBeenCalledWith(item);
  });

  it('throws CapturedItemNotFoundError when item does not exist', async () => {
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new MoveToTrashUseCase(repo).execute('missing'))
      .rejects.toThrow(CapturedItemNotFoundError);
  });

  it('throws ItemAlreadyResolvedError when item is not INBOX', async () => {
    const item = makeCapturedItem({ status: CapturedItemStatus.TRASH });
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    await expect(new MoveToTrashUseCase(repo).execute('item-1'))
      .rejects.toThrow(ItemAlreadyResolvedError);
  });
});
