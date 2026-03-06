import { Context } from '../../../../src/domain/context/context.entity';

describe('Context entity', () => {
  it('creates active context by default', () => {
    const context = Context.create({ id: 'ctx-1', name: 'Home' });
    expect(context.isActive()).toBe(true);
  });

  it('toggles active flag without losing associations', () => {
    const context = Context.create({ id: 'ctx-1', name: 'Home' });
    context.deactivate();
    expect(context.isActive()).toBe(false);
    context.activate();
    expect(context.isActive()).toBe(true);
  });

  it('rejects empty names', () => {
    expect(() => Context.create({ id: 'ctx-1', name: '   ' })).toThrow(
      'Context name cannot be empty.',
    );
  });
});

