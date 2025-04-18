using Actio.Application.Accounts.Handlers.GetAllAccounts;
using Actio.Application.Auth.Handlers.Login;
using Actio.Application.Auth.Handlers.Refresh;
using Actio.Application.Auth.Handlers.Register;
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
        services.AddScoped<IRefreshHandler, RefreshHandler>();
        services.AddScoped<IGetAllAccountsHandler, GetAllAccountsHandler>();
        return services;
    }
}
