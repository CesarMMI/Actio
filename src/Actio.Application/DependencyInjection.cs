using Actio.Application.Auth.Commands.Login;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ILoginCommand, LoginCommand>();
        return services;
    }
}
