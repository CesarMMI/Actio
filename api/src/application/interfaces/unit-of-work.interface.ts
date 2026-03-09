export const IUnitOfWork = Symbol('IUnitOfWork');

export interface IUnitOfWork {
  runInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
