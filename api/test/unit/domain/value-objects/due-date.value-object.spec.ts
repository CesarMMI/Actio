import { DueDate } from '../../../../src/domain/value-objects/due-date.value-object';

describe('DueDate ValueObject', () => {
  it('accepts a valid Date instance', () => {
    const now = new Date();
    const due = DueDate.create(now);
    expect(due.getValue()).toBeInstanceOf(Date);
  });

  it('accepts a valid date string', () => {
    const due = DueDate.create('2025-01-01T00:00:00.000Z');
    expect(due.getValue()).toBeInstanceOf(Date);
  });

  it('treats null/undefined as no due date', () => {
    expect(DueDate.create(null).getValue()).toBeNull();
    expect(DueDate.create(undefined).getValue()).toBeNull();
  });

  it('rejects invalid date input', () => {
    expect(() => DueDate.create('not-a-date')).toThrow('Invalid due date.');
  });
});

