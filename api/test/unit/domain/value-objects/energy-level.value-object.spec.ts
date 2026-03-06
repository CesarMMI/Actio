import { EnergyLevel } from '../../../../src/domain/value-objects/energy-level.value-object';

describe('EnergyLevel ValueObject', () => {
  it.each(['low', 'medium', 'high'])('accepts %s as valid', (value) => {
    const level = EnergyLevel.create(value);
    expect(level.getValue()).toBe(value);
  });

  it('rejects invalid energy level values', () => {
    expect(() => EnergyLevel.create('extreme')).toThrow(
      'Invalid energy level.',
    );
  });
});
