using Actio.Application.Auth.Services;
using Actio.Domain.Models;

namespace Actio.Infrastructure.Identity;

internal class JwtService : IJwtService
{
    public string GenerateAccessToken(User user)
    {
        return "token";
    }
}
