import { TimeBucket } from '../../../../src/domain/value-objects/time-bucket.value-object';
import { EnergyLevel } from '../../../../src/domain/value-objects/energy-level.value-object';

describe('TimeBucket VO', () => {
  it.each(['short', 'medium', 'long'])('accepts %s as valid', (value) => {
    const bucket = TimeBucket.create(value);
    expect(bucket.getValue()).toBe(value);
  });

  it('rejects invalid time bucket values', () => {
    expect(() => TimeBucket.create('very-long')).toThrow('Invalid time bucket.');
  });
});

describe('EnergyLevel VO', () => {
  it.each(['low', 'medium', 'high'])('accepts %s as valid', (value) => {
    const level = EnergyLevel.create(value);
    expect(level.getValue()).toBe(value);
  });

  it('rejects invalid energy level values', () => {
    expect(() => EnergyLevel.create('extreme')).toThrow('Invalid energy level.');
  });
});

