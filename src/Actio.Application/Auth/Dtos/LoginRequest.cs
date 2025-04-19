using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Auth.Dtos;

public class LoginRequest : BaseRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }

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
