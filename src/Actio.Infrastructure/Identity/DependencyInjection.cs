using Actio.Application.Auth.Shared.Interfaces;
using Actio.Infrastructure.Identity.Jwt;
using Actio.Infrastructure.Identity.Password;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Actio.Infrastructure.Identity;

internal static class DependencyInjection
{
    public static IServiceCollection AddIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IPasswordHasher, AspNetPasswordHasher>();

        services.AddScoped<IJwtService, JwtService>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuer = true,
                ValidIssuer = configuration["JWT:Issuer"]!,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:AccessSecret"]!))
            };
            options.Events = new JwtBearerEventsHandler();
        });

        services.AddAuthorization();

        return services;
    }
}
