﻿namespace Actio.Application.Auth.Interfaces;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string hashedPassword, string providedPassword);
}
