export type EnergyLevelValue = 'low' | 'medium' | 'high';

export const EnergyLevelValues = ['low', 'medium', 'high'] as const;

export class EnergyLevel {
  private constructor(private readonly value: EnergyLevelValue) {}

  static create(input: string): EnergyLevel {
    if (!EnergyLevelValues.includes(input as EnergyLevelValue)) {
      throw new Error('Invalid energy level.');
    }
    return new EnergyLevel(input as EnergyLevelValue);
  }

  getValue(): EnergyLevelValue {
    return this.value;
  }
}
