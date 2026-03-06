import { TimeBucket } from '../../../../src/domain/value-objects/time-bucket.value-object';

describe('TimeBucket ValueObject', () => {
  it.each(['short', 'medium', 'long'])('accepts %s as valid', (value) => {
    const bucket = TimeBucket.create(value);
    expect(bucket.getValue()).toBe(value);
  });

  it('rejects invalid time bucket values', () => {
    expect(() => TimeBucket.create('very-long')).toThrow('Invalid time bucket.');
  });
});
