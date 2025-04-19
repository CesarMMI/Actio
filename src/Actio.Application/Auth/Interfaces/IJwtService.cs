using System.Security.Claims;

namespace Actio.Application.Auth.Interfaces;

public interface IJwtService
{
    public string GenerateAccessToken(int userId);
    public string GenerateRefreshToken(int userId);
    public ClaimsPrincipal ValidateRefreshToken(string token);
}
