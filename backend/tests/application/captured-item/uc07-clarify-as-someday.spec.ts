import { ClarifyAsSomedayUseCase } from '../../../src/application/use-cases/captured-item/clarify-as-someday.use-case';
import { CapturedItemStatus } from '../../../src/domain/enums';
import { CapturedItemNotFoundError } from '../../../src/application/errors';
import { ItemAlreadyResolvedError } from '../../../src/domain/errors';
import { makeCapturedItem, mockCapturedItemRepo } from '../../helpers';

describe('UC-07 — Clarify as Someday/Maybe', () => {
  it('sets item status to SOMEDAY', async () => {
    const item = makeCapturedItem();
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const uc = new ClarifyAsSomedayUseCase(repo);

    await uc.execute('item-1');

    expect(item.status).toBe(CapturedItemStatus.SOMEDAY);
    expect(repo.save).toHaveBeenCalledWith(item);
  });

  it('throws CapturedItemNotFoundError when item does not exist', async () => {
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new ClarifyAsSomedayUseCase(repo).execute('missing'))
      .rejects.toThrow(CapturedItemNotFoundError);
  });

  it('throws ItemAlreadyResolvedError when item is not INBOX', async () => {
    const item = makeCapturedItem({ status: CapturedItemStatus.SOMEDAY });
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    await expect(new ClarifyAsSomedayUseCase(repo).execute('item-1'))
      .rejects.toThrow(ItemAlreadyResolvedError);
  });
});
