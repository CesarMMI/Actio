using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;
using Actio.Domain.Enums;

namespace Actio.Application.Actions.Dto;

public class GetAllActionsRequest : BaseRequest
{
    public EActionType ActionType { get; set; }
    public bool Done { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (!ActionType.IsValidEnum())
            throw new BadRequestException("Invalid action type");
    }
}
