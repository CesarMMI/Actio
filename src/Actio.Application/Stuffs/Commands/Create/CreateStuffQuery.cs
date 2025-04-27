using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.Stuffs.Commands.Create;

public class CreateStuffQuery : BaseQuery
{
    public required string Title { get; set; }
    public string? Description { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (!Title.IsValidString())
            throw new BadRequestException("Title is required");
        if (Title.Length > 100)
            throw new BadRequestException("Title length can't be greater than 100");
    }
}
