export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly name: string;

  constructor(message: string) {
    super(message);
  }
}
