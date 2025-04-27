using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Auth.Commands.Refresh;

public class RefreshQuery : BaseQuery
{
    public string RefreshToken { get; set; } = string.Empty;

    public override void Validate()
    {
        base.Validate();

        if (!RefreshToken.IsValidString())
            throw new BadRequestException("Refresh token is required");
    }
}
