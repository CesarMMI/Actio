export class Context {
  private active = true;

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly description?: string,
  ) {}

  static create(params: { id: string; name: string; description?: string }): Context {
    if (!params.name.trim()) {
      throw new Error('Context name cannot be empty.');
    }
    return new Context(params.id, params.name.trim(), params.description);
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

