using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.InboxItems.Handlers.CreateInboxItem;

public interface ICreateInboxItemHandler : IHandler<CreateInboxItemRequest, InboxItemResponse>
{
}
