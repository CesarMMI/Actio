namespace Actio.Application.Auth.Shared.Interfaces;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string hashedPassword, string providedPassword);
}
