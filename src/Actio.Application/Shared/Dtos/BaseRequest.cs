using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Shared.Dtos;

public abstract class BaseRequest
{
    public int UserId { get; set; }

    public virtual void Validate()
    {
        if (UserId < 1)
            throw new BadRequestException("User id is required");
    }
}
