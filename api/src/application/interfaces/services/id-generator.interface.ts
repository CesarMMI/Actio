export const IIdGenerator = Symbol('IIdGenerator');

export interface IIdGenerator {
  newId(): string;
}
