using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Application.Shared.Validators;

namespace Actio.Application.InboxItems.Dtos;

public class UpdateInboxItemRequest : BaseRequest
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public override void Validate()
    {
        base.Validate();

        if(Id < 0)
            throw new BadRequestException("Id id required");

        if (!Title.IsValidString())
            throw new BadRequestException("Title is required");

        if (!Description.IsValidString())
            throw new BadRequestException("Description is required");
    }
}
