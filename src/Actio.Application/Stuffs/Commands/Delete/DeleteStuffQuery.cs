using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Stuffs.Commands.Delete;

public class DeleteStuffQuery : BaseQuery
{
    public int Id { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (Id < 0)
            throw new BadRequestException("Id is required");
    }
}
