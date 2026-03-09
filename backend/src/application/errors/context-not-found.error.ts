export class ContextNotFoundError extends Error {
  constructor(id: string) {
    super(`Context not found: ${id}`);
    this.name = 'ContextNotFoundError';
  }
}
