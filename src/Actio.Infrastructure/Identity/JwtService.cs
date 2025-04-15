using Actio.Application.Interfaces;
using Actio.Domain.Models;
using System.Security.Claims;

namespace Actio.Infrastructure.Identity;

internal class JwtService : IJwtService
{
    public string GenerateAccessToken(User user)
    {
        throw new NotImplementedException();
    }

    public string GenerateRefreshToken(User user)
    {
        throw new NotImplementedException();
    }

    public ClaimsPrincipal ValidateRefreshToken(string token)
    {
        throw new NotImplementedException();
    }
}
