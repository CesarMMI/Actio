using Actio.Application.Auth.Commands.Login;
using Actio.Application.Auth.Commands.Refresh;
using Actio.Application.Auth.Commands.Register;
using Actio.Application.Stuffs.Commands.Create;
using Actio.Application.Stuffs.Commands.Delete;
using Actio.Application.Stuffs.Commands.GetAll;
using Actio.Application.Stuffs.Commands.GetById;
using Actio.Application.Stuffs.Commands.GetTypes;
using Actio.Application.Stuffs.Commands.Update;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ILoginCommand, LoginCommand>();
        services.AddScoped<IRegisterCommand, RegisterCommand>();
        services.AddScoped<IRefreshCommand, RefreshCommand>();

        services.AddScoped<ICreateStuffCommand, CreateStuffCommand>();
        services.AddScoped<IDeleteStuffCommand, DeleteStuffCommand>();
        services.AddScoped<IGetAllStuffsCommand, GetAllStuffsCommand>();
        services.AddScoped<IGetStuffByIdCommand, GetStuffByIdCommand>();
        services.AddScoped<IGetStuffTypesCommand, GetStuffTypesCommand>();
        services.AddScoped<IUpdateStuffCommand, UpdateStuffCommand>();

        return services;
    }
}
