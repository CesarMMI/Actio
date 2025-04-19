using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.InboxItems.Handlers.GetInboxItemById;

internal class GetInboxItemByIdHandler(IInboxItemRepository inboxItemRepository) : IGetInboxItemByIdHandler
{
    public async Task<InboxItemResponse> Handle(GetInboxItemByIdRequest request)
    {
        request.Validate();

        var inboxItem = await inboxItemRepository.GetByIdAsync(request.UserId, request.Id);

        if (inboxItem is null)
        {
            throw new NotFoundException("Inbox item not found");
        }

        return inboxItem.ToInboxItemResponse();
    }
}
