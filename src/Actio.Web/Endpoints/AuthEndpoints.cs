using Actio.Application.Dtos.Auth;
using Actio.Application.Handlers.Auth.Login;
using Actio.Application.Handlers.Auth.Register;
using Actio.Web.Extensions;
using Actio.Web.Filters;

namespace Actio.Web.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("auth");

        group
            .MapPost("login", 
            async (LoginRequest dto, ILoginHandler handler) => (await handler.Handle(dto))
            .ToResult(200))
            .Validate<LoginRequest>();
        group
            .MapPost("register", 
            async (RegisterRequest dto, IRegisterHandler handler) => (await handler.Handle(dto))
            .ToResult(200))
            .Validate<RegisterRequest>();

        return builder;
    }
}
