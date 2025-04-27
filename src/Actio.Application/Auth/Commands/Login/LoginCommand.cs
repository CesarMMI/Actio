using Actio.Application.Auth.Shared.Interfaces;
using Actio.Application.Auth.Shared.Results;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Commands.Login;

internal class LoginCommand(
    IPasswordHasher passwordHasher,
    IJwtService jwtService,
    IUserRepository userRepository
) : ILoginCommand
{
    public async Task<AuthResult> Handle(LoginQuery request)
    {
        request.Validate();

        var user = await userRepository.FindByEmailAsync(request.Email);

        if (user is null || !passwordHasher.Verify(user.Password, request.Password))
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        return new AuthResult
        {
            User = user.ToUserResult(),
            AccessToken = jwtService.GenerateAccessToken(user.Id),
            RefreshToken = jwtService.GenerateRefreshToken(user.Id),
        };
    }
}
