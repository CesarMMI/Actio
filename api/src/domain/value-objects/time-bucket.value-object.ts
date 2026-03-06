export type TimeBucketValue = 'short' | 'medium' | 'long';

export const TimeBucketValues = ['short', 'medium', 'long'] as const;

export class TimeBucket {
  private constructor(private readonly value: TimeBucketValue) {}

  static create(input: string): TimeBucket {
    if (!TimeBucketValues.includes(input as TimeBucketValue)) {
      throw new Error('Invalid time bucket.');
    }
    return new TimeBucket(input as TimeBucketValue);
  }

  getValue(): TimeBucketValue {
    return this.value;
  }
}

