using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;

namespace Actio.Application.InboxItems.Dtos;

public class DeleteInboxItemRequest : BaseRequest
{
    public int Id { get; set; }

    public override void Validate()
    {
        base.Validate();

        if (Id < 0)
            throw new BadRequestException("Id is required");
    }
}
