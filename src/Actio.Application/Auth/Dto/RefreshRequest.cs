using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Auth.Dto;

public class RefreshRequest : BaseRequest
{
    public required string RefreshToken { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (!RefreshToken.IsValidString())
            throw new BadRequestException("Refresh token is required");
    }
}
