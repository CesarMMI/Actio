using Actio.Domain.Models;
using System.Security.Claims;

namespace Actio.Application.Auth.Interfaces;

public interface IJwtService
{
    public string GenerateAccessToken(User user);
    public string GenerateRefreshToken(User user);
    public ClaimsPrincipal ValidateRefreshToken(string token);
}
