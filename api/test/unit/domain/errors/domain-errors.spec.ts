import { BusinessRuleViolationError } from '../../../../src/domain/errors/business-rule-violation.error';
import { InvalidStatusTransitionError } from "../../../../src/domain/errors/invalid-status-transition.error";
import { EntityNotFoundError } from "../../../../src/domain/errors/entity-not-found.error";

describe('Domain errors', () => {
  it('creates BusinessRuleViolationError with optional metadata', () => {
    const error = new BusinessRuleViolationError('Rule broken', { rule: 'test' });
    expect(error).toBeInstanceOf(BusinessRuleViolationError);
    expect(error.message).toBe('Rule broken');
    expect(error.metadata).toEqual({ rule: 'test' });
  });

  it('creates InvalidStatusTransitionError with entity and statuses', () => {
    const error = new InvalidStatusTransitionError('Action', 'OPEN', 'ARCHIVED');
    expect(error).toBeInstanceOf(InvalidStatusTransitionError);
    expect(error.message).toBe('Invalid status transition for Action: OPEN -> ARCHIVED');
    expect(error.entity).toBe('Action');
    expect(error.previousStatus).toBe('OPEN');
    expect(error.newStatus).toBe('ARCHIVED');
  });

  it('creates EntityNotFoundError with entity and id', () => {
    const error = new EntityNotFoundError('Action', 'id-1');
    expect(error).toBeInstanceOf(EntityNotFoundError);
    expect(error.message).toBe('Action with id id-1 was not found.');
    expect(error.entity).toBe('Action');
    expect(error.id).toBe('id-1');
  });
});

