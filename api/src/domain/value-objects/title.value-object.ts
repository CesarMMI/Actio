export class Title {
  private static readonly MAX_LENGTH = 200;

  private constructor(private readonly value: string) {}

  static create(raw: string): Title {
    const trimmed = raw.trim();

    if (!trimmed) {
      throw new Error('Title cannot be empty.');
    }

    if (trimmed.length > Title.MAX_LENGTH) {
      throw new Error(`Title cannot exceed ${Title.MAX_LENGTH} characters.`);
    }

    return new Title(trimmed);
  }

  getValue(): string {
    return this.value;
  }
}
