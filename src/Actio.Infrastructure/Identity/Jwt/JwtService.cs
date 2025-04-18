﻿using Actio.Application.Auth.Interfaces;
using Actio.Application.Exceptions;
using Actio.Domain.Models;
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

    public string GenerateAccessToken(User user)
    {
        return GenerateToken(user, accessSecret, DateTime.UtcNow.AddMinutes(accessExpiresMins));
    }

    public string GenerateRefreshToken(User user)
    {
        return GenerateToken(user, refreshSecret, DateTime.UtcNow.AddMinutes(refreshExpiresMins));
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
            ClockSkew = TimeSpan.Zero,
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

    private string GenerateToken(User user, string secret, DateTime expires)
    {
        var claims = new List<Claim> {
            new("name", user.Name),
            new("sub", user.Email)
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
