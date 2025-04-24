using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Actions.Dto;

public class GetActionByIdRequest : BaseRequest
{
    public int Id { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (Id < 1)
            throw new BadRequestException("Id is required");
    }
}
