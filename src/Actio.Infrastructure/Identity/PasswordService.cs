using Actio.Application.Auth.Services;

namespace Actio.Infrastructure.Identity;

internal class PasswordService : IPasswordService
{
    public string Hash(string password)
    {
        return password;
    }

    public bool Verify(string password, string hashedPassword)
    {
        return true;
    }
}
