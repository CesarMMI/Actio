using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;

namespace Actio.Application.Actions.Dtos;

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
