
export class EntityNotFoundError extends Error {
  constructor(readonly entity: string, readonly id: string) {
    super(`${entity} with id ${id} was not found.`);
    this.name = 'EntityNotFoundError';
  }
}
