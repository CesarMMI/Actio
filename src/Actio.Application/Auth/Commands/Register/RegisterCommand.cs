using Actio.Application.Auth.Shared.Interfaces;
using Actio.Application.Auth.Shared.Results;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Commands.Register;

internal class RegisterCommand(
    IPasswordHasher passwordHasher,
    IJwtService jwtService,
    IUserRepository userRepository
) : IRegisterCommand
{
    public async Task<AuthResult> Handle(RegisterQuery request)
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

        return new AuthResult
        {
            User = user.ToUserResult(),
            AccessToken = jwtService.GenerateAccessToken(user.Id),
            RefreshToken = jwtService.GenerateRefreshToken(user.Id)
        };
    }
}
