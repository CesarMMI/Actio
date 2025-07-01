using Actio.Application.Auth.Extensions;
using Actio.Application.Auth.Queries;
using Actio.Application.Auth.Results;
using Actio.Application.Auth.Services;
using Actio.Application.Shared.Extensions;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Commands.Login;

internal sealed class LoginCommand(

    IUserRepository userRepository,
    IJwtService jwtService,
    IPasswordService passwordService
) : ILoginCommand
{
    public async Task<AuthResult> ExecuteAsync(LoginQuery query)
    {
        Validate(query);

        var user = await userRepository.FindByEmailAsync(query.Email!);

        if (user is null || passwordService.Verify(query.Password!, user.HashedPassword))
            throw new Exception("Invalid email or password");

        return new AuthResult
        {
            AccessToken = jwtService.GenerateAccessToken(user),
            User = user.ToResult()
        };
    }

    private static void Validate(LoginQuery query)
    {
        if (query.Email.IsNullOrWhiteSpace())
            throw new Exception("Email is required");

        if (!query.Email.IsValidEmail())
            throw new Exception("Invalid email");

        if (query.Password.IsNullOrWhiteSpace())
            throw new Exception("Password is required");
    }
}
