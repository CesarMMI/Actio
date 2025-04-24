using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;
using Actio.Domain.Enums;

namespace Actio.Application.Actions.Dto;

public class UpdateActionRequest : BaseRequest
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Done { get; set; } = false;
    public EActionType Type { get; set; }
    public int? ProjectId { get; set; }


    public override void Validate()
    {
        base.Validate();

        if(Id < 0)
            throw new BadRequestException("Id id required");

        if (!Title.IsValidString())
            throw new BadRequestException("Title is required");
        if (Title.Length > 100)
            throw new BadRequestException("Title length can't be greater than 100");

        if (!Type.IsValidEnum())
            throw new BadRequestException("Invalid action type");
    }
}
