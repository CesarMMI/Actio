using Actio.Application.Actions.Handlers.CreateAction;
using Actio.Application.Actions.Handlers.DeleteAction;
using Actio.Application.Actions.Handlers.GetActionById;
using Actio.Application.Actions.Handlers.GetActionTypes;
using Actio.Application.Actions.Handlers.GetAllActions;
using Actio.Application.Actions.Handlers.UpdateAction;
using Actio.Application.Auth.Handlers.Login;
using Actio.Application.Auth.Handlers.Refresh;
using Actio.Application.Auth.Handlers.Register;
using Actio.Application.Projects.Handlers.GetAllProjects;
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

        services.AddScoped<IGetAllActionsHandler, GetAllActionsHandler>();
        services.AddScoped<IGetActionByIdHandler, GetActionByIdHandler>();
        services.AddScoped<ICreateActionHandler, CreateActionHandler>();
        services.AddScoped<IUpdateActionHandler, UpdateActionHandler>();
        services.AddScoped<IDeleteActionHandler, DeleteActionHandler>();
        services.AddScoped<IGetActionTypesHandler, GetActionTypesHandler>();

        services.AddScoped<IGetAllProjectsHandler, GetAllProjectsHandler>();

        return services;
    }
}
