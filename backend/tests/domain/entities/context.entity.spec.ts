import { Context } from '../../../src/domain/entities/context.entity';
import { InvalidContextTitleError } from '../../../src/domain/errors/invalid-context-title.error';

describe('Context entity', () => {
  describe('Context.create', () => {
    it('creates a context with valid title', () => {
      const ctx = Context.create({ title: 'At home' });
      expect(ctx.title).toBe('At home');
      expect(ctx.id).toBeDefined();
      expect(ctx.createdAt).toBeInstanceOf(Date);
      expect(ctx.updatedAt).toBeInstanceOf(Date);
    });

    it('rejects empty title', () => {
      expect(() => Context.create({ title: '' })).toThrow(InvalidContextTitleError);
    });

    it('rejects whitespace-only title', () => {
      expect(() => Context.create({ title: '   ' })).toThrow(InvalidContextTitleError);
    });

    it('generates unique ids for each context', () => {
      const c1 = Context.create({ title: 'Home' });
      const c2 = Context.create({ title: 'Office' });
      expect(c1.id).not.toBe(c2.id);
    });
  });

  describe('Context.reconstitute', () => {
    it('reconstitutes a context with all fields', () => {
      const now = new Date();
      const ctx = Context.reconstitute({ id: 'ctx-1', title: 'At home', createdAt: now, updatedAt: now });
      expect(ctx.id).toBe('ctx-1');
      expect(ctx.title).toBe('At home');
    });
  });

  describe('rename', () => {
    it('renames with valid title', () => {
      const ctx = Context.create({ title: 'At home' });
      ctx.rename('At office');
      expect(ctx.title).toBe('At office');
    });

    it('refreshes updatedAt on rename', () => {
      const ctx = Context.create({ title: 'At home' });
      const before = ctx.updatedAt;
      ctx.rename('At office');
      expect(ctx.updatedAt >= before).toBe(true);
    });

    it('rejects empty title on rename', () => {
      const ctx = Context.create({ title: 'At home' });
      expect(() => ctx.rename('')).toThrow(InvalidContextTitleError);
    });

    it('rejects whitespace-only title on rename', () => {
      const ctx = Context.create({ title: 'At home' });
      expect(() => ctx.rename('   ')).toThrow(InvalidContextTitleError);
    });
  });
});
