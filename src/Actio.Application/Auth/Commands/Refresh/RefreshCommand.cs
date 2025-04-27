using Actio.Application.Auth.Shared.Interfaces;
using Actio.Application.Auth.Shared.Results;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;
using System.Security.Claims;

namespace Actio.Application.Auth.Commands.Refresh;

internal class RefreshCommand(IJwtService jwtService, IUserRepository userRepository) : IRefreshCommand
{
    public async Task<AuthResult> Handle(RefreshQuery request)
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

        return new AuthResult
        {
            User = user.ToUserResult(),
            AccessToken = accessToken,
            RefreshToken = request.RefreshToken
        };
    }
}
