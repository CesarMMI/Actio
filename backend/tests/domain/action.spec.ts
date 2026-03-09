import { ActionStatus } from '../../src/domain/enums';
import { ActionNotOpenError, ActionNotCompletedError } from '../../src/domain/errors';
import { makeAction } from '../helpers';

describe('Action', () => {
  describe('complete', () => {
    it('transitions OPEN → COMPLETED', () => {
      const action = makeAction({ status: ActionStatus.OPEN });
      action.complete();
      expect(action.status).toBe(ActionStatus.COMPLETED);
    });

    it('throws ActionNotOpenError when status is COMPLETED', () => {
      const action = makeAction({ status: ActionStatus.COMPLETED });
      expect(() => action.complete()).toThrow(ActionNotOpenError);
    });

    it('throws ActionNotOpenError when status is ARCHIVED', () => {
      const action = makeAction({ status: ActionStatus.ARCHIVED });
      expect(() => action.complete()).toThrow(ActionNotOpenError);
    });
  });

  describe('archive', () => {
    it('transitions COMPLETED → ARCHIVED', () => {
      const action = makeAction({ status: ActionStatus.COMPLETED });
      action.archive();
      expect(action.status).toBe(ActionStatus.ARCHIVED);
    });

    it('throws ActionNotCompletedError when status is OPEN', () => {
      const action = makeAction({ status: ActionStatus.OPEN });
      expect(() => action.archive()).toThrow(ActionNotCompletedError);
    });

    it('throws ActionNotCompletedError when status is ARCHIVED', () => {
      const action = makeAction({ status: ActionStatus.ARCHIVED });
      expect(() => action.archive()).toThrow(ActionNotCompletedError);
    });
  });

  describe('assignProject', () => {
    it('sets projectId', () => {
      const action = makeAction();
      action.assignProject('project-1');
      expect(action.projectId).toBe('project-1');
    });

    it('clears projectId when null is passed', () => {
      const action = makeAction({ projectId: 'p-1' });
      action.assignProject(null);
      expect(action.projectId).toBeUndefined();
    });
  });

  describe('assignContext', () => {
    it('sets contextId', () => {
      const action = makeAction();
      action.assignContext('ctx-1');
      expect(action.contextId).toBe('ctx-1');
    });

    it('clears contextId when null is passed', () => {
      const action = makeAction({ contextId: 'ctx-1' });
      action.assignContext(null);
      expect(action.contextId).toBeUndefined();
    });
  });
});
