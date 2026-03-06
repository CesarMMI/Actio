export type EnergyLevelValue = 'low' | 'medium' | 'high';

export class EnergyLevel {
  private constructor(private readonly value: EnergyLevelValue) {}

  static create(input: string): EnergyLevel {
    if (input !== 'low' && input !== 'medium' && input !== 'high') {
      throw new Error('Invalid energy level.');
    }
    return new EnergyLevel(input);
  }

  getValue(): EnergyLevelValue {
    return this.value;
  }
}

