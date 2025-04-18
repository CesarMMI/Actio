using Actio.Application.Auth.Dtos;
using Actio.Application.Auth.Handlers.Login;
using Actio.Application.Auth.Handlers.Register;
using Actio.Web.Extensions;
using Actio.Web.Filters;

namespace Actio.Web.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("auth");

        group
            .MapPost("login", HandlerExtensions.HandleNoAuth<ILoginHandler, LoginRequest, AuthResponse>())
            .Validate<LoginRequest>();
        group
            .MapPost("register", HandlerExtensions.HandleNoAuth<IRegisterHandler, RegisterRequest, AuthResponse>())
            .Validate<RegisterRequest>();

        return builder;
    }
}
