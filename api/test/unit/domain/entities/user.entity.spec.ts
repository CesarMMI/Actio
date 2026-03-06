import { User } from '../../../../src/domain/entities/user.entity';

describe('User entity', () => {
  it('creates a user with valid email and password hash', () => {
    const user = User.create({
      id: 'user-1',
      email: 'User@Example.com',
      passwordHash: 'hashed-password-123',
    });
    expect(user.email).toBe('user@example.com');
  });

  it('rejects invalid emails', () => {
    expect(() =>
      User.create({
        id: 'user-1',
        email: 'invalid-email',
        passwordHash: 'hashed-password-123',
      }),
    ).toThrow('Invalid email.');
  });

  it('rejects invalid password hashes', () => {
    expect(() =>
      User.create({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'short',
      }),
    ).toThrow('Password hash appears invalid.');
  });
});

