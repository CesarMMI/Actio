import { Title } from '../../../../src/domain/value-objects/title.value-object';

describe('Title ValueObject', () => {
  it('trims whitespace and accepts a normal title', () => {
    const title = Title.create('  Do something  ');
    expect(title.getValue()).toBe('Do something');
  });

  it('rejects empty or whitespace-only titles', () => {
    expect(() => Title.create('   ')).toThrow('Title cannot be empty.');
  });

  it('rejects overly long titles', () => {
    const long = 'a'.repeat(201);
    expect(() => Title.create(long)).toThrow(
      'Title cannot exceed 200 characters.',
    );
  });
});
