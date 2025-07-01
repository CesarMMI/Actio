using Actio.Application.Auth.Commands.Login;
using Actio.Application.Auth.Commands.Register;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services
            .AddScoped<ILoginCommand, LoginCommand>()
            .AddScoped<IRegisterCommand, RegisterCommand>();
    }
}
