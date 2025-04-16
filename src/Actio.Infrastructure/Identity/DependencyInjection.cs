using Actio.Application.Interfaces;
using Actio.Infrastructure.Extensions;
using Actio.Infrastructure.Identity.Jwt;
using Actio.Infrastructure.Identity.Password;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Infrastructure.Identity;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IPasswordHasher, AspNetPasswordHasher>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = JwtExtensions.GetTokenValidationParameters(configuration["JWT:Issuer"]!, configuration["JWT:AccessSecret"]!);
            options.Events = new JwtBearerEventsHandler();
        });

        return services;
    }
}
