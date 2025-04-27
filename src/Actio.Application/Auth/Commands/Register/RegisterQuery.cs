using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Auth.Commands.Register;

public class RegisterQuery : BaseQuery
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public override void Validate()
    {
        if (!Name.IsValidString())
            throw new BadRequestException("Name is required");
        if (Name.Length < 5)
            throw new BadRequestException("Name length can't be lower than 5");
        if (Name.Length > 100)
            throw new BadRequestException("Name length can't be greater than 100");

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
