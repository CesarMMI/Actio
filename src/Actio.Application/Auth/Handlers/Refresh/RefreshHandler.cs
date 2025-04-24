using Actio.Application.Auth.Dto;
using Actio.Application.Auth.Interfaces;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;
using System.Security.Claims;

namespace Actio.Application.Auth.Handlers.Refresh;

internal class RefreshHandler(IJwtService jwtService, IUserRepository userRepository) : IRefreshHandler
{
    public async Task<AuthResponse> Handle(RefreshRequest request)
    {
        request.Validate();

        int userId;
        try
        {
            var claims = jwtService.ValidateRefreshToken(request.RefreshToken);
            var sub = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            userId = int.Parse(sub?.Value ?? string.Empty);
        }
        catch (Exception)
        {
            throw new UnauthorizedException("Invalid token");
        }

        var user = await userRepository.FindByIdAsync(request.UserId);
        if (user is null || userId != user.Id)
        {
            throw new UnauthorizedException("Invalid token");
        }

        string accessToken = jwtService.GenerateAccessToken(user.Id);

        return new AuthResponse
        {
            User = user.ToResponse(),
            AccessToken = accessToken,
            RefreshToken = request.RefreshToken
        };
    }
}
