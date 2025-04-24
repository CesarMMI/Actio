using Actio.Application.Auth.Dto;
using Actio.Application.Auth.Interfaces;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Handlers.Login;

internal class LoginHandler(IPasswordHasher passwordHasher, IJwtService jwtService, IUserRepository userRepository) : ILoginHandler
{
    public async Task<AuthResponse> Handle(LoginRequest request)
    {
        request.Validate();

        var user = await userRepository.FindByEmailAsync(request.Email);

        if (user is null || !passwordHasher.Verify(user.Password, request.Password))
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        return new AuthResponse
        {
            User = user.ToResponse(),
            AccessToken = jwtService.GenerateAccessToken(user.Id),
            RefreshToken = jwtService.GenerateRefreshToken(user.Id),
        };
    }
}
