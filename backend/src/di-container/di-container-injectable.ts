export class Injectable<T> {
  readonly token: symbol;

  constructor(token: string) {
    this.token = Symbol(token);
  }
}
