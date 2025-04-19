using Actio.Application.Auth.Handlers.Login;
using Actio.Application.Auth.Handlers.Refresh;
using Actio.Application.Auth.Handlers.Register;
using Actio.Application.InboxItems.Handlers.CreateInboxItem;
using Actio.Application.InboxItems.Handlers.DeleteInboxItem;
using Actio.Application.InboxItems.Handlers.GetAllInboxItems;
using Actio.Application.InboxItems.Handlers.GetInboxItemById;
using Actio.Application.InboxItems.Handlers.UpdateInboxItem;
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

        services.AddScoped<IGetAllInboxItemsHandler, GetAllInboxItemsHandler>();
        services.AddScoped<IGetInboxItemByIdHandler, GetInboxItemByIdHandler>();
        services.AddScoped<ICreateInboxItemHandler, CreateInboxItemHandler>();
        services.AddScoped<IUpdateInboxItemHandler, UpdateInboxItemHandler>();
        services.AddScoped<IDeleteInboxItemHandler, DeleteInboxItemHandler>();

        return services;
    }
}
