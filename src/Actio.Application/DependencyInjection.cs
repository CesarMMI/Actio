using Actio.Application.Handlers.Auth.Login;
using Actio.Application.Handlers.Auth.Register;
using Actio.Application.Handlers.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services
            .AddHandlers();
    }

    private static IServiceCollection AddHandlers(this IServiceCollection services)
    {
        services.AddScoped<ILoginHandler, LoginHandler>();
        services.AddScoped<IRegisterHandler, RegisterHandler>();
        services.AddScoped<IGetAllTasksHandler, GetAllTasksHandler>();
        return services;
    }
}
