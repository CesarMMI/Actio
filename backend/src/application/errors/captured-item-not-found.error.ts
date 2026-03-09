export class CapturedItemNotFoundError extends Error {
  constructor(id: string) {
    super(`CapturedItem not found: ${id}`);
    this.name = 'CapturedItemNotFoundError';
  }
}
