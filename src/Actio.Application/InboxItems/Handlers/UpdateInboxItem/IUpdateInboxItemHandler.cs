using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.InboxItems.Handlers.UpdateInboxItem;

public interface IUpdateInboxItemHandler : IHandler<UpdateInboxItemRequest, InboxItemResponse>
{
}
