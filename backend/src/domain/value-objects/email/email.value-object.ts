import { InvalidEmailError } from "../../errors/auth/invalid-email.error";
import { ValueObject } from "../value-object";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email extends ValueObject<Email> {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) throw new InvalidEmailError();
    return new Email(normalized);
  }

  static load(stored: string): Email {
    return new Email(stored);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
