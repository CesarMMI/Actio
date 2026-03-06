import { Action } from '../../../../src/domain/action/action.entity';
import { Title } from '../../../../src/domain/value-objects/title.value-object';
import { TimeBucket } from '../../../../src/domain/value-objects/time-bucket.value-object';
import { EnergyLevel } from '../../../../src/domain/value-objects/energy-level.value-object';
import { InvalidStatusTransitionError } from "../../../../src/domain/errors/invalid-status-transition.error";

describe('Action entity', () => {
  const make = () =>
    Action.create({
      id: 'action-1',
      title: Title.create('Do something'),
      notes: 'notes',
      timeBucket: TimeBucket.create('short'),
      energyLevel: EnergyLevel.create('low'),
    });

  it('creates OPEN action with associations', () => {
    const action = make();
    expect(action.getStatus()).toBe('OPEN');
  });

  it('supports assigning project and context', () => {
    const action = make();
    action.assignProject('project-1');
    action.assignContext('context-1');
    expect(action.getProjectId()).toBe('project-1');
    expect(action.getContextId()).toBe('context-1');
  });

  it('allows OPEN -> COMPLETED -> ARCHIVED transitions', () => {
    const action = make();
    action.complete();
    expect(action.getStatus()).toBe('COMPLETED');
    action.archive();
    expect(action.getStatus()).toBe('ARCHIVED');
  });

  it('rejects invalid status transitions', () => {
    const action = make();
    action.complete();
    expect(() => action.complete()).toThrow(InvalidStatusTransitionError);
    const another = make();
    expect(() => another.archive()).toThrow(InvalidStatusTransitionError);
  });
});

