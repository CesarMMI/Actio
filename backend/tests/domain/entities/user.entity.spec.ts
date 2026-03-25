import { User } from '../../../src/domain/entities/user/user.entity';
import { InvalidEmailError } from '../../../src/domain/errors/auth/invalid-email.error';
import { Email } from '../../../src/domain/value-objects/email/email.value-object';

describe('User entity', () => {
  describe('User.create', () => {
    it('creates a user with valid email and hash', () => {
      const user = User.create({ email: Email.create('test@example.com'), passwordHash: 'hash123', role: 'default' });
      expect(user.id).toBeDefined();
      expect(user.email.value).toBe('test@example.com');
      expect(user.passwordHash).toBe('hash123');
      expect(user.role).toBe('default');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('creates user with admin role when specified', () => {
      const user = User.create({ email: Email.create('admin@example.com'), passwordHash: 'hash', role: 'admin' });
      expect(user.role).toBe('admin');
    });

    it('creates user with optional name', () => {
      const user = User.create({ email: Email.create('user@example.com'), passwordHash: 'hash', role: 'default', name: 'Alice' });
      expect(user.name).toBe('Alice');
    });

    it('creates user without name when not provided', () => {
      const user = User.create({ email: Email.create('user@example.com'), passwordHash: 'hash', role: 'default' });
      expect(user.name).toBeUndefined();
    });
  });

  describe('User.load', () => {
    it('restores all props', () => {
      const now = new Date();
      const user = User.load({
        id: 'abc-123',
        email: Email.load('user@example.com'),
        passwordHash: 'hash',
        role: 'admin',
        name: 'Bob',
        createdAt: now,
        updatedAt: now,
      });
      expect(user.id).toBe('abc-123');
      expect(user.email.value).toBe('user@example.com');
      expect(user.role).toBe('admin');
      expect(user.name).toBe('Bob');
    });
  });

  describe('changePassword', () => {
    it('updates the password hash and updatedAt', () => {
      const user = User.create({ email: Email.create('user@example.com'), passwordHash: 'oldhash', role: 'default' });
      const before = user.updatedAt;
      user.changePassword('newhash');
      expect(user.passwordHash).toBe('newhash');
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('Email value object', () => {
    it('normalizes raw input on create', () => {
      const email = Email.create('  Test@Example.COM  ');
      expect(email.value).toBe('test@example.com');
    });

    it('normalizes email to lowercase', () => {
      expect(Email.create('TEST@EXAMPLE.COM').value).toBe('test@example.com');
    });

    it('trims whitespace from email', () => {
      expect(Email.create('  user@example.com  ').value).toBe('user@example.com');
    });

    it('throws InvalidEmailError for invalid input', () => {
      expect(() => Email.create('notanemail')).toThrow(InvalidEmailError);
      expect(() => Email.create('')).toThrow(InvalidEmailError);
      expect(() => Email.create('@domain.com')).toThrow(InvalidEmailError);
    });

    it('throws InvalidEmailError for email without domain', () => {
      expect(() => Email.create('user@')).toThrow(InvalidEmailError);
    });

    it('load skips validation', () => {
      expect(() => Email.load('not-valid')).not.toThrow();
      expect(Email.load('not-valid').value).toBe('not-valid');
    });

    it('equals compares by value', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('user@example.com');
      const c = Email.create('other@example.com');
      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    it('toString returns the normalized value', () => {
      const email = Email.create('User@Example.com');
      expect(email.toString()).toBe('user@example.com');
    });
  });
});
