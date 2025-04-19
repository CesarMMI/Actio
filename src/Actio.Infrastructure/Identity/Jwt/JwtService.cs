using Actio.Application.Auth.Interfaces;
using Actio.Application.Shared.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Actio.Infrastructure.Identity.Jwt;

internal class JwtService : IJwtService
{
    private readonly string issuer;
    private readonly string accessSecret;
    private readonly string refreshSecret;
    private readonly double accessExpiresMins;
    private readonly double refreshExpiresMins;

    private readonly JwtSecurityTokenHandler tokenHandler;

    public JwtService(IConfiguration configuration)
    {
        tokenHandler = new JwtSecurityTokenHandler();
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        issuer = configuration["JWT:Issuer"]!;
        accessSecret = configuration["JWT:AccessSecret"]!;
        refreshSecret = configuration["JWT:RefreshSecret"]!;
        accessExpiresMins = double.Parse(configuration["JWT:AccessExpiresMins"]!);
        refreshExpiresMins = double.Parse(configuration["JWT:RefreshExpiresMins"]!);
    }

    public string GenerateAccessToken(int userId)
    {
        return GenerateToken(userId, accessSecret, DateTime.Now.AddMinutes(accessExpiresMins));
    }

    public string GenerateRefreshToken(int userId)
    {
        return GenerateToken(userId, refreshSecret, DateTime.Now.AddMinutes(refreshExpiresMins));
    }

    public ClaimsPrincipal ValidateRefreshToken(string token)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = GetSymmetricSecurityKey(refreshSecret)
        };

        try
        {
            return tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
        }
        catch (SecurityTokenException)
        {
            throw new UnauthorizedException("Invalid token");
        }
    }

    private string GenerateToken(int userId, string secret, DateTime expires)
    {
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var key = GetSymmetricSecurityKey(secret);
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: issuer,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        return tokenHandler.WriteToken(tokenDescriptor);
    }

    private static SymmetricSecurityKey GetSymmetricSecurityKey(string secret)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }
}
