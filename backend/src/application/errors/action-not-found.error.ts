export class ActionNotFoundError extends Error {
  constructor(id: string) {
    super(`Action not found: ${id}`);
    this.name = 'ActionNotFoundError';
  }
}
