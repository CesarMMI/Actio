using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.InboxItems.Dtos;

public class CreateInboxItemRequest : BaseRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Resolved { get; set; } = false;

    public override void Validate()
    {
        base.Validate();

        if (!Title.IsValidString())
            throw new BadRequestException("Title is required");
        if (Title.Length > 100)
            throw new BadRequestException("Title length can't be greater than 100");

        if (!Description.IsValidString())
            throw new BadRequestException("Description is required");
        if (Description.Length > 100)
            throw new BadRequestException("Description length can't be greater than 100");
    }
}
