export type TimeBucketValue = 'short' | 'medium' | 'long';

export class TimeBucket {
  private constructor(private readonly value: TimeBucketValue) {}

  static create(input: string): TimeBucket {
    if (input !== 'short' && input !== 'medium' && input !== 'long') {
      throw new Error('Invalid time bucket.');
    }
    return new TimeBucket(input);
  }

  getValue(): TimeBucketValue {
    return this.value;
  }
}

