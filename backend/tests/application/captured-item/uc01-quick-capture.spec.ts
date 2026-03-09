import { QuickCaptureUseCase } from '../../../src/application/use-cases/captured-item/quick-capture.use-case';
import { CapturedItemStatus } from '../../../src/domain/enums';
import { mockCapturedItemRepo } from '../../helpers';

describe('UC-01 — Quick Capture', () => {
  it('creates a CapturedItem with status INBOX', async () => {
    const repo = mockCapturedItemRepo();
    const uc = new QuickCaptureUseCase(repo);

    const item = await uc.execute({ title: 'Buy milk' });

    expect(item.title).toBe('Buy milk');
    expect(item.status).toBe(CapturedItemStatus.INBOX);
    expect(item.id).toBeDefined();
    expect(repo.save).toHaveBeenCalledWith(item);
  });

  it('persists optional notes', async () => {
    const repo = mockCapturedItemRepo();
    const uc = new QuickCaptureUseCase(repo);

    const item = await uc.execute({ title: 'Call dentist', notes: 'Ask about X-ray' });

    expect(item.notes).toBe('Ask about X-ray');
  });
});
