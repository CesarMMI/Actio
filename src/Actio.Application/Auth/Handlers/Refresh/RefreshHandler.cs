using Actio.Application.Auth.Dtos;
using Actio.Application.Auth.Interfaces;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Handlers.Refresh;

internal class RefreshHandler(IJwtService jwtService, IUserRepository userRepository) : IRefreshHandler
{
    public async Task<AuthResponse> Handle(RefreshRequest request)
    {
        var claims = jwtService.ValidateRefreshToken(request.RefreshToken);
        var sub = claims.Claims.FirstOrDefault(c => c.Type == "sub");

        var user = await userRepository.FindByIdAsync(request.UserId);

        if (user is null || sub?.Value != user.Email)
        {
            throw new UnauthorizedException("Invalid token");
        }

        string accessToken = jwtService.GenerateAccessToken(user);

        return new AuthResponse
        {
            User = user.ToUserResponse(),
            AccessToken = accessToken,
            RefreshToken = request.RefreshToken
        };
    }
}
