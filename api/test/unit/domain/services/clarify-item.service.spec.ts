import { ClarifyItemService } from '../../../../src/domain/services/clarify-item.service';
import { CapturedItem } from '../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../src/domain/value-objects/title.value-object';
import { BusinessRuleViolationError } from '../../../../src/domain/errors/business-rule-violation.error';

describe('ClarifyItemService', () => {
  const service = new ClarifyItemService();

  const makeItem = () =>
    CapturedItem.create({
      id: 'item-1',
      title: Title.create('Inbox item'),
    });

  it('clarifies INBOX item as Action', () => {
    const item = makeItem();
    const result = service.clarifyAsAction(item, { actionId: 'action-1' });

    expect(result.updatedItem.getStatus()).toBe('CLARIFIED_AS_ACTION');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].getStatus()).toBe('OPEN');
  });

  it('refuses to clarify non-INBOX item as Action', () => {
    const item = makeItem();
    item.clarifyAsProject();
    expect(() =>
      service.clarifyAsAction(item, { actionId: 'action-1' }),
    ).toThrow(BusinessRuleViolationError);
  });

  it('clarifies INBOX item as Project with optional first action', () => {
    const item = makeItem();
    const result = service.clarifyAsProject(item, {
      projectId: 'project-1',
      firstActionId: 'action-1',
    });

    expect(result.updatedItem.getStatus()).toBe('CLARIFIED_AS_PROJECT');
    expect(result.project.getStatus()).toBe('ACTIVE');
    expect(result.actions).toHaveLength(1);
  });
});

