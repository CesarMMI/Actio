using Actio.Application.InboxItems.Dtos;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.InboxItems.Handlers.CreateInboxItem;

internal class CreateInboxItemHandler(IInboxItemRepository inboxItemRepository) : ICreateInboxItemHandler
{
    public async Task<InboxItemResponse> Handle(CreateInboxItemRequest request)
    {
        request.Validate();

        var inboxItem = new InboxItem
        {
            UserId = request.UserId,
            Title = request.Title,
            Description = request.Description,
            Resolved = request.Resolved
        };
        inboxItem = await inboxItemRepository.CreateAsync(inboxItem);

        return inboxItem.ToInboxItemResponse();
    }
}
