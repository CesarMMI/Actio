import { ContextAlreadyActiveError, ContextNotActiveError } from '../../src/domain/errors';
import { makeContext } from '../helpers';

describe('Context', () => {
  describe('rename', () => {
    it('updates the name', () => {
      const ctx = makeContext();
      ctx.rename('@home');
      expect(ctx.name).toBe('@home');
    });
  });

  describe('deactivate', () => {
    it('sets active to false when currently active', () => {
      const ctx = makeContext({ active: true });
      ctx.deactivate();
      expect(ctx.active).toBe(false);
    });

    it('throws ContextNotActiveError when already inactive', () => {
      const ctx = makeContext({ active: false });
      expect(() => ctx.deactivate()).toThrow(ContextNotActiveError);
    });
  });

  describe('activate', () => {
    it('sets active to true when currently inactive', () => {
      const ctx = makeContext({ active: false });
      ctx.activate();
      expect(ctx.active).toBe(true);
    });

    it('throws ContextAlreadyActiveError when already active', () => {
      const ctx = makeContext({ active: true });
      expect(() => ctx.activate()).toThrow(ContextAlreadyActiveError);
    });
  });
});
