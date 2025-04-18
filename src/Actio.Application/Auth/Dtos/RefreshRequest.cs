using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Auth.Dtos;

public class RefreshRequest : BaseRequest
{
    public string RefreshToken { get; set; } = string.Empty;

    public override void Validate()
    {
        if (UserId < 1)
            throw new BadRequestException("User id is required");

        if (!RefreshToken.IsValidString())
            throw new BadRequestException("Refresh token is required");
    }
}
