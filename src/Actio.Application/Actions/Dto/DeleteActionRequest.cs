using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Actions.Dto;

public class DeleteActionRequest : BaseRequest
{
    public int Id { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (Id < 0)
            throw new BadRequestException("Id is required");
    }
}
