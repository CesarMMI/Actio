using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.InboxItems.Handlers.DeleteInboxItem;

internal class DeleteInboxItemHandler(IInboxItemRepository inboxItemRepository) : IDeleteInboxItemHandler
{
    public async Task<InboxItemResponse> Handle(DeleteInboxItemRequest request)
    {
        request.Validate();

        var inboxItem = await inboxItemRepository.GetByIdAsync(request.UserId, request.Id);

        if (inboxItem is null)
        {
            throw new NotFoundException("Inbox item not found");
        }

        inboxItem = await inboxItemRepository.DeleteAsync(inboxItem);

        return inboxItem.ToInboxItemResponse();
    }
}
