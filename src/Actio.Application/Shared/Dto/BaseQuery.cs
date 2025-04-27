using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Shared.Dto;

public class BaseQuery
{
    public int UserId { get; set; }

    public virtual void Validate()
    {
        if (UserId < 1)
            throw new BadRequestException("User id is required");
    }
}
