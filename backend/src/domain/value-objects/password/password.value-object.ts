import { PasswordTooLongError } from "../../errors/auth/password-too-long.error";
import { PasswordTooShortError } from "../../errors/auth/password-too-short.error";
import { ValueObject } from "../value-object";

const MIN_LENGTH = 5;
const MAX_LENGTH = 50;

export class Password extends ValueObject<Password> {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  static create(raw: string): Password {
    if (raw.length < MIN_LENGTH) throw new PasswordTooShortError(MIN_LENGTH);
    if (raw.length > MAX_LENGTH) throw new PasswordTooLongError(MAX_LENGTH);
    return new Password(raw);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
