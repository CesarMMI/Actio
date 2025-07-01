using Actio.Application.Auth.Extensions;
using Actio.Application.Auth.Queries;
using Actio.Application.Auth.Results;
using Actio.Application.Auth.Services;
using Actio.Application.Shared.Extensions;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Auth.Commands.Register;

internal class RegisterCommand(
    IUserRepository userRepository,
    IJwtService jwtService,
    IPasswordService passwordService
) : IRegisterCommand
{
    public async Task<AuthResult> ExecuteAsync(RegisterQuery query)
    {
        Validate(query);

        var user = await userRepository.FindByEmailAsync(query.Email!);

        if (user is not null) throw new Exception("Email already in use");

        user = new User
        {
            Name = query.Name!,
            Email = query.Email!,
            HashedPassword = passwordService.Hash(query.Password!)
        };

        user = await userRepository.CreateAsync(user);

        return new AuthResult()
        {
            User = user.ToResult(),
            AccessToken = jwtService.GenerateAccessToken(user)
        };
    }

    private static void Validate(RegisterQuery query)
    {
        if (query.Name.IsNullOrWhiteSpace())
            throw new Exception("Name is required");
        if (query.Name!.Length <= 3)
            throw new Exception("Name length should be greater than 3");
        if (query.Name!.Length >= 100)
            throw new Exception("Name length should be lower than 100");

        if (query.Email.IsNullOrWhiteSpace())
            throw new Exception("Email is required");
        if (query.Email!.Length <= 3)
            throw new Exception("Email length should be greater than 3");
        if (query.Email!.Length >= 100)
            throw new Exception("Email length should be lower than 100");
        if (!query.Email.IsValidEmail())
            throw new Exception("Invalid email");

        if (query.Password.IsNullOrWhiteSpace())
            throw new Exception("Password is required");
        if (query.Password!.Length <= 3)
            throw new Exception("Password length should be greater than 3");
        if (query.Password!.Length >= 100)
            throw new Exception("Password length should be lower than 100");
    }
}
