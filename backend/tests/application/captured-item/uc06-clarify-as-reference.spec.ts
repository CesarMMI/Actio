import { ClarifyAsReferenceUseCase } from '../../../src/application/use-cases/captured-item/clarify-as-reference.use-case';
import { CapturedItemStatus } from '../../../src/domain/enums';
import { CapturedItemNotFoundError } from '../../../src/application/errors';
import { ItemAlreadyResolvedError } from '../../../src/domain/errors';
import { makeCapturedItem, mockCapturedItemRepo } from '../../helpers';

describe('UC-06 — Clarify as Reference', () => {
  it('sets item status to REFERENCE', async () => {
    const item = makeCapturedItem();
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const uc = new ClarifyAsReferenceUseCase(repo);

    await uc.execute('item-1');

    expect(item.status).toBe(CapturedItemStatus.REFERENCE);
    expect(repo.save).toHaveBeenCalledWith(item);
  });

  it('throws CapturedItemNotFoundError when item does not exist', async () => {
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new ClarifyAsReferenceUseCase(repo).execute('missing'))
      .rejects.toThrow(CapturedItemNotFoundError);
  });

  it('throws ItemAlreadyResolvedError when item is not INBOX', async () => {
    const item = makeCapturedItem({ status: CapturedItemStatus.REFERENCE });
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    await expect(new ClarifyAsReferenceUseCase(repo).execute('item-1'))
      .rejects.toThrow(ItemAlreadyResolvedError);
  });
});
