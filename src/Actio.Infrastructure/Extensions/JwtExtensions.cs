using Actio.Application.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

namespace Actio.Infrastructure.Extensions;

internal static class JwtExtensions
{
    public static TokenValidationParameters GetTokenValidationParameters(string secret, string issuer)
    {
        return new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = GetSymmetricSecurityKey(secret)
        };
    }

    public static SymmetricSecurityKey GetSymmetricSecurityKey(string secret)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }

    public static Task WriteResponse(this HttpResponse response, string message)
    {
        response.StatusCode = 401;
        response.ContentType = "application/json";
        return response.WriteAsync(JsonSerializer.Serialize(
            new BaseResponse<dynamic> { Message = message },
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        ));
    }
}
