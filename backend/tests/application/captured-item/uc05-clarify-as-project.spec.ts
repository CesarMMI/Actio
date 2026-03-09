import { ClarifyAsProjectUseCase } from '../../../src/application/use-cases/captured-item/clarify-as-project.use-case';
import { CapturedItemStatus, ProjectStatus } from '../../../src/domain/enums';
import { CapturedItemNotFoundError } from '../../../src/application/errors';
import { ItemAlreadyResolvedError } from '../../../src/domain/errors';
import { makeCapturedItem, mockCapturedItemRepo, mockProjectRepo } from '../../helpers';

describe('UC-05 — Clarify as Project', () => {
  it('marks item as CLARIFIED_AS_PROJECT and creates an ACTIVE project', async () => {
    const item = makeCapturedItem();
    const capturedItems = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const projects = mockProjectRepo();
    const uc = new ClarifyAsProjectUseCase(capturedItems, projects);

    const project = await uc.execute({ capturedItemId: 'item-1', projectName: 'My project' });

    expect(item.status).toBe(CapturedItemStatus.CLARIFIED_AS_PROJECT);
    expect(project.name).toBe('My project');
    expect(project.status).toBe(ProjectStatus.ACTIVE);
    expect(capturedItems.save).toHaveBeenCalledWith(item);
    expect(projects.save).toHaveBeenCalledWith(project);
  });

  it('throws CapturedItemNotFoundError when item does not exist', async () => {
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new ClarifyAsProjectUseCase(repo, mockProjectRepo());

    await expect(uc.execute({ capturedItemId: 'missing', projectName: 'x' }))
      .rejects.toThrow(CapturedItemNotFoundError);
  });

  it('throws ItemAlreadyResolvedError when item is not INBOX', async () => {
    const item = makeCapturedItem({ status: CapturedItemStatus.TRASH });
    const repo = mockCapturedItemRepo({ findById: jest.fn().mockResolvedValue(item) });
    const uc = new ClarifyAsProjectUseCase(repo, mockProjectRepo());

    await expect(uc.execute({ capturedItemId: 'item-1', projectName: 'x' }))
      .rejects.toThrow(ItemAlreadyResolvedError);
  });
});
