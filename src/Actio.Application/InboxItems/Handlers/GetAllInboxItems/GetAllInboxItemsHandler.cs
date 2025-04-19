using Actio.Application.InboxItems.Dtos;
using Actio.Domain.Repositories;

namespace Actio.Application.InboxItems.Handlers.GetAllInboxItems;

internal class GetAllInboxItemsHandler(IInboxItemRepository inboxItemRepository) : IGetAllInboxItemsHandler
{
    public async Task<GetAllInboxItemsResponse> Handle(GetAllInboxItemsRequest request)
    {
        request.Validate();

        var inboxItems = (await inboxItemRepository
            .GetAllAsync(request.UserId))
            .Select(item => item.ToInboxItemResponse())
            .ToList();

        return new GetAllInboxItemsResponse { Data = inboxItems };
    }
}
