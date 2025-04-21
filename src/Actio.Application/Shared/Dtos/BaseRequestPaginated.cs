using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Shared.Dtos;

public abstract class BaseRequestPaginated : BaseRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public override void Validate()
    {
        base.Validate();

        if (Page < 1)
            throw new BadRequestException("Page must be greater than 0");

        if (PageSize < 1)
            throw new BadRequestException("Page size must be greater than 0");
        if (PageSize > 100)
            throw new BadRequestException("Page size must be less than or equal to 100");
    }
}
