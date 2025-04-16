using Actio.Application.Dtos.Auth;
using Actio.Application.Exceptions;
using Actio.Application.Interfaces;
using Actio.Domain.Repositories;

namespace Actio.Application.Handlers.Auth.Login;

internal class LoginHandler(IPasswordHasher passwordHasher, IJwtService jwtService, IUserRepository userRepository) : ILoginHandler
{
    public async Task<AuthResponse> Handle(LoginRequest request)
    {
        var user = await userRepository.FindByEmailAsync(request.Email);

        if (user is null || !passwordHasher.Verify(user.Password, request.Password))
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        return new AuthResponse
        {
            User = user.ToUserResponse(),
            AccessToken = jwtService.GenerateAccessToken(user),
            RefreshToken = jwtService.GenerateRefreshToken(user),
        };
    }
}
