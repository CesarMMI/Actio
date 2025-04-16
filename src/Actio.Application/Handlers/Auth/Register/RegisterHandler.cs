using Actio.Application.Dtos.Auth;
using Actio.Application.Exceptions;
using Actio.Application.Interfaces;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Handlers.Auth.Register;

internal class RegisterHandler(IPasswordHasher passwordHasher, IJwtService jwtService, IUserRepository userRepository) : IRegisterHandler
{
    public async Task<AuthResponse> Handle(RegisterRequest request)
    {
        if ((await userRepository.FindByEmailAsync(request.Email)) is not null)
        {
            throw new BadRequestException("Email already in use");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = passwordHasher.Hash(request.Password)
        };

        user = await userRepository.CreateAsync(user);

        return new AuthResponse
        {
            User = user.ToUserResponse(),
            AccessToken = jwtService.GenerateAccessToken(user),
            RefreshToken = jwtService.GenerateRefreshToken(user)
        };
    }
}
