using Actio.Application.Auth.Services;
using Microsoft.AspNet.Identity;

namespace Actio.Infrastructure.Identity;

internal class PasswordAspNetService : IPasswordService
{
    private readonly PasswordHasher hasher = new();

    public string Hash(string password)
    {
        return hasher.HashPassword(password);
    }

    public bool Verify(string password, string hashedPassword)
    {
        var result = hasher.VerifyHashedPassword(hashedPassword, password);
        return result == PasswordVerificationResult.Success;
    }
}
