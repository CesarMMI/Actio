using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.InboxItems.Handlers.UpdateInboxItem;

internal class UpdateInboxItemHandler(IInboxItemRepository inboxItemRepository) : IUpdateInboxItemHandler
{
    public async Task<InboxItemResponse> Handle(UpdateInboxItemRequest request)
    {
        request.Validate();

        var inboxItem = await inboxItemRepository.GetByIdAsync(request.UserId, request.Id);

        if (inboxItem is null)
        {
            throw new NotFoundException("Inbox item not found");
        }

        inboxItem.Title = request.Title;
        inboxItem.Description = request.Description;
        inboxItem.UpdatedAt = DateTime.Now;

        inboxItem = await inboxItemRepository.UpdateAsync(inboxItem);

        if (inboxItem is null)
        {
            throw new NotFoundException("Inbox item not found");
        }

        return inboxItem.ToInboxItemResponse();
    }
}
