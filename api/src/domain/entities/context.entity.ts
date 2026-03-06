export class Context {
  private active = true;

  private constructor(
    readonly id: string,
    private name: string,
    readonly description?: string,
  ) {}

  static create(params: {
    id: string;
    name: string;
    description?: string;
  }): Context {
    if (!params.name.trim()) {
      throw new Error('Context name cannot be empty.');
    }
    return new Context(params.id, params.name.trim(), params.description);
  }

  getName(): string {
    return this.name;
  }

  rename(name: string): void {
    if (!name.trim()) {
      throw new Error('Context name cannot be empty.');
    }
    this.name = name.trim();
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
  }

  activate(): void {
    this.active = true;
  }
}
