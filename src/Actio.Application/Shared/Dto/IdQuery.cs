using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Shared.Dto;

public class IdQuery : BaseQuery
{
    public int Id { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (Id < 0)
            throw new BadRequestException("Id is required");
    }
}
