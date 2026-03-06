import { CapturedItem } from '../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../src/domain/value-objects/title.value-object';
import { BusinessRuleViolationError } from '../../../../src/domain/errors/business-rule-violation.error';

describe('CapturedItem entity', () => {
  const make = () =>
    CapturedItem.create({
      id: 'item-1',
      title: Title.create('Inbox item'),
    });

  it('starts in INBOX status', () => {
    const item = make();
    expect(item.getStatus()).toBe('INBOX');
  });

  it('allows clarification to different outcomes from INBOX', () => {
    const item1 = make();
    item1.clarifyAsAction();
    expect(item1.getStatus()).toBe('CLARIFIED_AS_ACTION');

    const item2 = make();
    item2.clarifyAsProject();
    expect(item2.getStatus()).toBe('CLARIFIED_AS_PROJECT');

    const item3 = make();
    item3.clarifyAsReference();
    expect(item3.getStatus()).toBe('REFERENCE');

    const item4 = make();
    item4.clarifyAsSomeday();
    expect(item4.getStatus()).toBe('SOMEDAY');

    const item5 = make();
    item5.moveToTrash();
    expect(item5.getStatus()).toBe('TRASH');
  });

  it('rejects re-clarifying an already clarified item', () => {
    const item = make();
    item.clarifyAsAction();
    expect(() => item.clarifyAsProject()).toThrow(BusinessRuleViolationError);
  });
});
