using Actio.Application.Auth.Commands.Login;
using Actio.Application.Auth.Commands.Refresh;
using Actio.Application.Auth.Commands.Register;
using Actio.Web.Extensions;

namespace Actio.Web.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("auth");

        group.MapPost("login", async (LoginQuery query, ILoginCommand command) =>
        {
            return await command.Handle(query).WriteResponse();
        });

        group.MapPost("register", async (RegisterQuery query, IRegisterCommand command) =>
        {
            return await command.Handle(query).WriteResponse(201);
        });

        group.MapPost("refresh", async (RefreshQuery query, IRefreshCommand command) =>
        {
            return await command.Handle(query).WriteResponse();
        });

        return builder;
    }
}
