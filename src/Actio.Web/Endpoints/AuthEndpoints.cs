using Actio.Application.Auth.Dtos;
using Actio.Application.Auth.Handlers.Login;
using Actio.Application.Auth.Handlers.Refresh;
using Actio.Application.Auth.Handlers.Register;
using Actio.Web.Filters;

namespace Actio.Web.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("auth");

        group.MapPost("login", async (LoginRequest request, ILoginHandler handler) =>
        {
            return Results.Ok(await handler.Handle(request));
        })
            .Validate<LoginRequest>();

        group.MapPost("register", async (RegisterRequest request, IRegisterHandler handler) =>
        {
            return Results.Ok(await handler.Handle(request));
        })
            .Validate<RegisterRequest>();

        group.MapPost("refresh", async (RefreshRequest request, IRefreshHandler handler) =>
        {
            return Results.Ok(await handler.Handle(request));
        })
            .Validate<RefreshRequest>();

        return builder;
    }
}
