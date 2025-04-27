using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Auth.Commands.Login;

public class LoginQuery : BaseQuery
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public override void Validate()
    {
        if (!Email.IsValidString())
            throw new BadRequestException("Email is required");
        if (!Email.IsValidEmail())
            throw new BadRequestException("Invalid email");

        if (!Password.IsValidString())
            throw new BadRequestException("Password is required");
        if (Password.Length < 5)
            throw new BadRequestException("Password length can't be lower than 5");
        if (Password.Length > 100)
            throw new BadRequestException("Password length can't be greater than 100");
    }
}
