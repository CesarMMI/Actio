export class DueDate {
  private constructor(private readonly value: Date | null) {}

  static create(input: Date | string | null | undefined): DueDate {
    if (input == null) {
      return new DueDate(null);
    }

    const date = typeof input === 'string' ? new Date(input) : input;
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid due date.');
    }

    return new DueDate(date);
  }

  getValue(): Date | null {
    return this.value;
  }
}
