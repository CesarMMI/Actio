using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.InboxItems.Handlers.GetAllInboxItems;

public interface IGetAllInboxItemsHandler : IHandler<GetAllInboxItemsRequest, GetAllInboxItemsResponse>
{
}
