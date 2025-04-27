using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Stuffs.Commands.Update;

public class UpdateStuffQuery : IdQuery
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? ProjectId { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (Id < 1)
            throw new BadRequestException("Id is required");

        if (!Title.IsValidString())
            throw new BadRequestException("Title is required");
        if (Title.Length > 100)
            throw new BadRequestException("Title length can't be greater than 100");

        if (ProjectId is not null && ProjectId < 1)
            throw new BadRequestException("Project id is invalid");
    }
}
