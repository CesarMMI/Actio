using Actio.Application.Auth.Dtos;
using Actio.Application.Auth.Handlers.Login;
using Actio.Application.Auth.Handlers.Refresh;
using Actio.Application.Auth.Handlers.Register;
using Actio.Web.Extensions;

namespace Actio.Web.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("auth");

        group.MapPost("login", async (LoginRequest request, ILoginHandler handler) =>
        {
            return await handler.Handle(request).WriteResponse();
        });

        group.MapPost("register", async (RegisterRequest request, IRegisterHandler handler) =>
        {
            return await handler.Handle(request).WriteResponse(201);
        });

        group.MapPost("refresh", async (RefreshRequest request, IRefreshHandler handler) =>
        {
            return await handler.Handle(request).WriteResponse();
        });

        return builder;
    }
}
