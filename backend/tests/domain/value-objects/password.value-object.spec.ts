import { PasswordTooLongError } from '../../../src/domain/errors/auth/password-too-long.error';
import { PasswordTooShortError } from '../../../src/domain/errors/auth/password-too-short.error';
import { Password } from '../../../src/domain/value-objects/password/password.value-object';

describe('Password value object', () => {
  describe('Password.create', () => {
    it('returns a VO with the correct value for valid input', () => {
      const password = Password.create('securepass');
      expect(password.value).toBe('securepass');
    });

    it('accepts exactly 5 characters (min boundary)', () => {
      expect(() => Password.create('ab12!')).not.toThrow();
      expect(Password.create('ab12!').value).toBe('ab12!');
    });

    it('accepts exactly 50 characters (max boundary)', () => {
      const exactly50 = 'a'.repeat(50);
      expect(() => Password.create(exactly50)).not.toThrow();
      expect(Password.create(exactly50).value).toBe(exactly50);
    });

    it('throws PasswordTooShortError for strings shorter than 5 characters', () => {
      expect(() => Password.create('ab12')).toThrow(PasswordTooShortError);
    });

    it('throws PasswordTooShortError for empty string', () => {
      expect(() => Password.create('')).toThrow(PasswordTooShortError);
    });

    it('throws PasswordTooLongError for strings longer than 50 characters', () => {
      expect(() => Password.create('a'.repeat(51))).toThrow(PasswordTooLongError);
    });
  });

  describe('equals', () => {
    it('returns true for the same raw value', () => {
      const a = Password.create('samepassword');
      const b = Password.create('samepassword');
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different values', () => {
      const a = Password.create('password1!');
      const b = Password.create('password2!');
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the raw value', () => {
      const password = Password.create('mypassword');
      expect(password.toString()).toBe('mypassword');
    });
  });
});
