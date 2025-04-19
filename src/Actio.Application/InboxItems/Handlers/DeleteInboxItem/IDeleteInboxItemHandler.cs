using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.InboxItems.Handlers.DeleteInboxItem;

public interface IDeleteInboxItemHandler : IHandler<DeleteInboxItemRequest, InboxItemResponse>
{
}
