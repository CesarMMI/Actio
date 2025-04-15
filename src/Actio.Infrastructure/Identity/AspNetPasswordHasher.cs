using Actio.Application.Interfaces;

namespace Actio.Infrastructure.Identity;

internal class AspNetPasswordHasher : IPasswordHasher
{
    private readonly Microsoft.AspNet.Identity.PasswordHasher hasher = new();

    public string Hash(string password)
    {
        return hasher.HashPassword(password);
    }

    public bool Verify(string hashedPassword, string providedPassword)
    {
        return hasher.VerifyHashedPassword(hashedPassword, providedPassword) == Microsoft.AspNet.Identity.PasswordVerificationResult.Success;
    }
}
