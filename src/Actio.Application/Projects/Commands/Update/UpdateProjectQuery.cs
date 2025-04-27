using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Projects.Commands.Update;

public class UpdateProjectQuery : IdQuery
{
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (!Name.IsValidString())
            throw new BadRequestException("Name is required");
        if (Name.Length > 100)
            throw new BadRequestException("Name length can't be greater than 100");

        if (Color is not null && !Color.IsValidColor())
            throw new BadRequestException("Color is not valid");
    }
}
