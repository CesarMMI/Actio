import { InvalidEmailError } from '../../../src/domain/errors/auth/invalid-email.error';
import { Email } from '../../../src/domain/value-objects/email/email.value-object';

describe('Email value object', () => {
  describe('Email.create', () => {
    it('returns a VO with the correct value for a valid email', () => {
      const email = Email.create('user@example.com');
      expect(email.value).toBe('user@example.com');
    });

    it('normalizes by trimming whitespace and lowercasing', () => {
      const email = Email.create('  User@Example.COM  ');
      expect(email.value).toBe('user@example.com');
    });

    it('throws InvalidEmailError for a missing @', () => {
      expect(() => Email.create('userexample.com')).toThrow(InvalidEmailError);
    });

    it('throws InvalidEmailError for a missing domain', () => {
      expect(() => Email.create('user@')).toThrow(InvalidEmailError);
    });

    it('throws InvalidEmailError for an empty string', () => {
      expect(() => Email.create('')).toThrow(InvalidEmailError);
    });

    it('throws InvalidEmailError for whitespace-only input', () => {
      expect(() => Email.create('   ')).toThrow(InvalidEmailError);
    });
  });

  describe('Email.load', () => {
    it('bypasses validation and returns a VO with the stored value', () => {
      const email = Email.load('stored@example.com');
      expect(email.value).toBe('stored@example.com');
    });
  });

  describe('equals', () => {
    it('returns true for two VOs with the same value', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('user@example.com');
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for two VOs with different values', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('other@example.com');
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the normalized email string', () => {
      const email = Email.create('User@Example.COM');
      expect(email.toString()).toBe('user@example.com');
    });
  });
});
