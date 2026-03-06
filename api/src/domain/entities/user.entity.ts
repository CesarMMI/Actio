export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly passwordHash: string,
  ) {}

  static create(params: {
    id: string;
    email: string;
    passwordHash: string;
  }): User {
    if (!params.email.includes('@')) {
      throw new Error('Invalid email.');
    }
    if (!params.passwordHash || params.passwordHash.length < 10) {
      throw new Error('Password hash appears invalid.');
    }
    return new User(params.id, params.email.toLowerCase(), params.passwordHash);
  }
}
