using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;
using Actio.Domain.Enums;

namespace Actio.Application.Actions.Dtos;

public class CreateActionRequest : BaseRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Done { get; set; } = false;
    public EActionType Type { get; set; } = EActionType.Next;
    public int? ProjectId { get; set; }


    public override void Validate()
    {
        base.Validate();

        if (!Title.IsValidString())
            throw new BadRequestException("Title is required");
        if (Title.Length > 100)
            throw new BadRequestException("Title length can't be greater than 100");

        if(!Type.IsValidEnum())
            throw new BadRequestException("Invalid action type");
    }
}
