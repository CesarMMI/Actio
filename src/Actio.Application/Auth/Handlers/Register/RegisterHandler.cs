using Actio.Application.Auth.Dtos;
using Actio.Application.Auth.Interfaces;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Handlers.Register;

internal class RegisterHandler(IPasswordHasher passwordHasher, IJwtService jwtService, IUserRepository userRepository) : IRegisterHandler
{
    public async Task<AuthResponse> Handle(RegisterRequest request)
    {
        request.Validate();

        if (await userRepository.FindByEmailAsync(request.Email) is not null)
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
            AccessToken = jwtService.GenerateAccessToken(user.Id),
            RefreshToken = jwtService.GenerateRefreshToken(user.Id)
        };
    }
}
