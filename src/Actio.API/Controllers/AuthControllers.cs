using Actio.Application.Auth.Commands.Login;
using Actio.Application.Auth.Commands.Register;
using Actio.Application.Auth.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Actio.API.Controllers;

public static class AuthControllers
{
    public static IEndpointRouteBuilder MapAuthControllers(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth").WithTags("Auth");
        // Login
        group.MapPost("/login", async (ILoginCommand command, [FromBody] LoginQuery query) =>
            Results.Ok(await command.ExecuteAsync(query))
        ).WithName("Login");
        // Register
        group.MapPost("/register", async (IRegisterCommand command, [FromBody] RegisterQuery query) =>
            Results.Ok(await command.ExecuteAsync(query))
        ).WithName("Register");
        return app;
    }
}
